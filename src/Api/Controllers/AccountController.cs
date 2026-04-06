using Api.Data;
using Api.Models;
using Api.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Services.Administration;
using Services.Security;

namespace Api.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : BaseController
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IAdministrationService _administrationService;
        private readonly IJwtTokenService _jwtTokenService;
        private readonly IConfiguration _configuration;

        public AccountController(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IAdministrationService administrationService,
            ISecurityService securityService,
            IJwtTokenService jwtTokenService,
            IConfiguration configuration
            )
        {
            _userManager = userManager;
            _administrationService = administrationService;
            _jwtTokenService = jwtTokenService;
            _configuration = configuration;
        }

        /// <summary>
        /// Legacy JSON sign-in used by AccountGoWeb MVC. Returns a <c>result</c> property on success so the client can build a cookie session.
        /// </summary>
        [HttpPost]
        [Route("SignIn")]
        public async System.Threading.Tasks.Task<IActionResult> SignIn([FromBody] dynamic loginViewModel)
        {
            if (loginViewModel == null)
            {
                throw new System.ArgumentNullException(nameof(loginViewModel));
            }

            string password = loginViewModel.Password;
            string username = loginViewModel.Email;

            try
            {
                var applicationUser = await _userManager.FindByEmailAsync(username);
                if (applicationUser == null)
                {
                    System.Console.WriteLine($"Unable to load user with email '{username}'.");
                    return Ok(new { message = "Invalid login attempt." });
                }

                if (await _userManager.CheckPasswordAsync(applicationUser, password))
                {
                    return Ok(new
                    {
                        result = new
                        {
                            succeeded = true,
                            email = applicationUser.Email,
                            id = applicationUser.Id
                        }
                    });
                }
            }
            catch (System.Exception ex)
            {
                System.Console.WriteLine(ex.StackTrace);
            }

            return Ok(new { message = "Invalid login attempt." });
        }

        /// <summary>
        /// JWT access token for SPA clients (GoodBooks React).
        /// </summary>
        [HttpPost]
        [Route("token")]
        public async System.Threading.Tasks.Task<IActionResult> Token([FromBody] TokenRequest body)
        {
            if (body == null || string.IsNullOrWhiteSpace(body.Email) || string.IsNullOrWhiteSpace(body.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }

            var user = await _userManager.FindByEmailAsync(body.Email.Trim());
            if (user == null || !await _userManager.CheckPasswordAsync(user, body.Password))
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            var roles = await _userManager.GetRolesAsync(user);
            var token = _jwtTokenService.CreateAccessToken(user, roles);
            var minutes = int.TryParse(_configuration["Jwt:AccessTokenMinutes"], out var m) ? m : 480;

            return Ok(new
            {
                access_token = token,
                token_type = "Bearer",
                expires_in = minutes * 60,
                email = user.Email
            });
        }

        [HttpPost]
        [Route("AddNewUser")]
        public async System.Threading.Tasks.Task<IActionResult> AddNewUser([FromBody] dynamic registerViewModel)
        {
            try
            {
                if (registerViewModel == null)
                {
                    throw new System.ArgumentNullException(nameof(registerViewModel));
                }

                string password = registerViewModel.Password;
                string username = registerViewModel.Email;
                string firstName = registerViewModel.FirstName;
                string lastName = registerViewModel.LastName;

                var user = new ApplicationUser { UserName = username, Email = username };
                var result = await _userManager.CreateAsync(user, password);
                if (result.Succeeded)
                {
                    Core.Domain.Security.User newUser =
                        new Core.Domain.Security.User
                        {
                            EmailAddress = username,
                            UserName = username,
                            Firstname = firstName,
                            Lastname = lastName
                        };

                    _administrationService.SaveUser(newUser);

                    return new ObjectResult(result);
                }
                return new BadRequestObjectResult(result);
            }
            catch (System.Exception ex)
            {
                var errors = new[] { ex.InnerException != null ? ex.InnerException.Message : ex.Message };
                return new BadRequestObjectResult(errors);
            }
        }
    }
}
