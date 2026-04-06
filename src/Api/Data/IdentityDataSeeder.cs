using System.Linq;
using Core.Data;
using Core.Domain.Security;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Services.Security;

namespace Api.Data;

/// <summary>
/// Creates the demo ASP.NET Identity user and matching domain security user when missing.
/// Business setup (company, COA, etc.) still comes from <c>/api/administration/setup</c>.
/// </summary>
public static class IdentityDataSeeder
{
    public const string DefaultAdminEmail = "admin@accountgo.ph";
    public const string DefaultAdminPassword = "P@ssword1";

    public static async Task SeedAsync(
        UserManager<ApplicationUser> userManager,
        RoleManager<IdentityRole> roleManager,
        ISecurityService securityService,
        ISecurityRepository securityRepository,
        ApiDbContext apiDbContext,
        ILogger logger,
        CancellationToken cancellationToken = default)
    {
        if (!await apiDbContext.Database.CanConnectAsync(cancellationToken))
        {
            logger.LogWarning("IdentityDataSeeder skipped: cannot connect to application database.");
            return;
        }

        if (securityService.GetRole("SystemAdministrators") == null)
        {
            securityService.AddRole("SystemAdministrators");
        }

        if (securityService.GetRole("GeneralUsers") == null)
        {
            securityService.AddRole("GeneralUsers");
        }

        foreach (var roleName in new[] { "SystemAdministrators", "GeneralUsers" })
        {
            if (!await roleManager.RoleExistsAsync(roleName))
            {
                var ir = await roleManager.CreateAsync(new IdentityRole(roleName));
                if (!ir.Succeeded)
                {
                    logger.LogWarning(
                        "Could not create Identity role {Role}: {Errors}",
                        roleName,
                        string.Join("; ", ir.Errors.Select(e => e.Description)));
                }
            }
        }

        var identityUser = await userManager.FindByEmailAsync(DefaultAdminEmail);
        if (identityUser == null)
        {
            identityUser = new ApplicationUser
            {
                UserName = DefaultAdminEmail,
                Email = DefaultAdminEmail,
                EmailConfirmed = true,
            };

            var createResult = await userManager.CreateAsync(identityUser, DefaultAdminPassword);
            if (!createResult.Succeeded)
            {
                logger.LogError(
                    "Failed to create default Identity user: {Errors}",
                    string.Join("; ", createResult.Errors.Select(e => e.Description)));
                return;
            }

            logger.LogInformation("Created default Identity user {Email}.", DefaultAdminEmail);
        }

        identityUser = await userManager.FindByEmailAsync(DefaultAdminEmail);
        if (identityUser != null && !await userManager.IsInRoleAsync(identityUser, "SystemAdministrators"))
        {
            var addRole = await userManager.AddToRoleAsync(identityUser, "SystemAdministrators");
            if (!addRole.Succeeded)
            {
                logger.LogWarning(
                    "Could not add {Email} to SystemAdministrators: {Errors}",
                    DefaultAdminEmail,
                    string.Join("; ", addRole.Errors.Select(e => e.Description)));
            }
        }

        if (securityRepository.GetUser(DefaultAdminEmail) != null)
        {
            return;
        }

        var sysAdminRole = securityService.GetRole("SystemAdministrators");
        if (sysAdminRole == null)
        {
            logger.LogWarning("IdentityDataSeeder: SystemAdministrators domain role missing; skipping domain user.");
            return;
        }

        var domainUser = new User
        {
            UserName = DefaultAdminEmail,
            EmailAddress = DefaultAdminEmail,
            Firstname = "System",
            Lastname = "Administrator",
        };

        domainUser.Roles.Add(new SecurityUserRole
        {
            SecurityRole = sysAdminRole,
            User = domainUser,
        });

        securityRepository.AddUser(domainUser);
        logger.LogInformation("Created default domain user {Email} for security/GetUser.", DefaultAdminEmail);
    }
}
