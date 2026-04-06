using System;
using System.Text;
using Api.Data;
using Api.Data.Repositories;
using Api.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
.AddNewtonsoftJson(
    options =>
        {
            options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
            options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        }
    );

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionTemplate = builder.Configuration.GetConnectionString("DefaultConnection") ?? throw new InvalidOperationException("Connection string 'DefaultConnection' not found.");

string connectionString;
if (connectionTemplate.Contains("{0}", StringComparison.Ordinal))
{
    string dbServer = System.Environment.GetEnvironmentVariable("DBSERVER") ?? "localhost,1444";
    string dbUserID = System.Environment.GetEnvironmentVariable("DBUSERID") ?? "sa";
    string dbUserPassword = System.Environment.GetEnvironmentVariable("DBPASSWORD") ?? "SqlPassword!";
    string dbName = System.Environment.GetEnvironmentVariable("DBNAME") ?? "accountgodb";
    connectionString = string.Format(connectionTemplate, dbServer, dbUserID, dbUserPassword, dbName);
}
else
{
    connectionString = connectionTemplate;
}

System.Console.WriteLine("DB Connection String: " + connectionString);

builder.Services
    .AddDbContext<ApiDbContext>(options =>
        options.UseSqlServer(connectionString, sql =>
            sql.MigrationsHistoryTable("__EFMigrationsHistory", "Api")))
    .AddDbContext<ApplicationIdentityDbContext>(options =>
        options.UseSqlServer(connectionString, sql =>
            sql.MigrationsHistoryTable("__EFMigrationsHistory", "Identity")));

builder.Services
    .AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationIdentityDbContext>()
    .AddDefaultTokenProviders();

var jwtKey = builder.Configuration["Jwt:Key"] ?? throw new InvalidOperationException("Jwt:Key is not configured.");
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddSingleton<IJwtTokenService, JwtTokenService>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = !string.IsNullOrEmpty(jwtIssuer),
        ValidIssuer = jwtIssuer,
        ValidateAudience = !string.IsNullOrEmpty(jwtAudience),
        ValidAudience = jwtAudience,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
        ValidateLifetime = true,
        ClockSkew = TimeSpan.FromMinutes(2)
    };
});

builder.Services.AddAuthorization();

var AllowAllOrigins = "AllowAll";
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: AllowAllOrigins,
                      policy =>
                      {
                          policy.AllowAnyOrigin()
                                .AllowAnyMethod()
                                .AllowAnyHeader();
                      });
});

builder.Services.AddScoped(typeof(Core.Data.IRepository<>), typeof(EfRepository<>));
builder.Services.AddScoped(typeof(Core.Data.ISalesOrderRepository), typeof(SalesOrderRepository));
builder.Services.AddScoped(typeof(Core.Data.IPurchaseOrderRepository), typeof(PurchaseOrderRepository));
builder.Services.AddScoped(typeof(Core.Data.ISecurityRepository), typeof(SecurityRepository));

builder.Services.AddScoped(typeof(Services.Sales.ISalesService), typeof(Services.Sales.SalesService));
builder.Services.AddScoped(typeof(Services.Financial.IFinancialService), typeof(Services.Financial.FinancialService));
builder.Services.AddScoped(typeof(Services.Inventory.IInventoryService), typeof(Services.Inventory.InventoryService));
builder.Services.AddScoped(typeof(Services.Purchasing.IPurchasingService), typeof(Services.Purchasing.PurchasingService));
builder.Services.AddScoped(typeof(Services.Administration.IAdministrationService), typeof(Services.Administration.AdministrationService));
builder.Services.AddScoped(typeof(Services.Security.ISecurityService), typeof(Services.Security.SecurityService));
builder.Services.AddScoped(typeof(Services.TaxSystem.ITaxService), typeof(Services.TaxSystem.TaxService));

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseCors(AllowAllOrigins);
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var apiDbContext = services.GetRequiredService<ApiDbContext>();
    if (!apiDbContext.Database.GetAppliedMigrations().Any())
    {
        apiDbContext.Database.Migrate();
    }

    var identityDbContext = services.GetRequiredService<ApplicationIdentityDbContext>();
    if (!identityDbContext.Database.GetAppliedMigrations().Any())
    {
        identityDbContext.Database.Migrate();
    }

    var logger = services.GetRequiredService<ILoggerFactory>().CreateLogger("IdentityDataSeeder");
    try
    {
        IdentityDataSeeder.SeedAsync(
                services.GetRequiredService<UserManager<ApplicationUser>>(),
                services.GetRequiredService<RoleManager<IdentityRole>>(),
                services.GetRequiredService<Services.Security.ISecurityService>(),
                services.GetRequiredService<Core.Data.ISecurityRepository>(),
                apiDbContext,
                logger)
            .GetAwaiter()
            .GetResult();
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Default admin user seeding failed.");
    }
}

app.Run();
