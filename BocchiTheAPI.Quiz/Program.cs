using System.Globalization;
using BocchiTheAPI.Quiz.Hubs;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using SurrealDB.Configuration;
using SurrealDB.Extensions.Service;

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddJsonFile("appsettings.local.json", true);
builder.Services.AddControllers();
builder.Host.UseOrleans(siloBuilder => 
{
    siloBuilder.UseLocalhostClustering();
});
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(corsBuilder =>
    {
        corsBuilder.WithOrigins(builder.Configuration["WebApplicationUrl"]!)
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.Services.AddSignalR();
builder.Services.AddSurrealDB(config =>
    config.WithEndpoint("127.0.0.1:8000")
    .WithDatabase("bocchi")
    .WithNamespace("global")
    .WithBasicAuth("root", "root")
    .WithRest(insecure: true));
builder.Services.AddAuthentication(options =>
    {
        options.DefaultScheme = CookieAuthenticationDefaults.AuthenticationScheme;
    })
    .AddCookie(setup =>
    {
        setup.ExpireTimeSpan = TimeSpan.FromDays(1);
        setup.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = 401;
            return Task.CompletedTask;
        };
    }).AddDiscord(options =>
{
    options.ClientId = builder.Configuration["Discord:ClientId"]!;
    options.ClientSecret = builder.Configuration["Discord:ClientSecret"]!;
    options.Scope.Add("identify");

    options.ClaimActions.MapCustomJson("urn:discord:avatar:url", user =>
    {
        var avatar = user.GetString("avatar");
        
        if (avatar == null)
            return "https://cdn.discordapp.com/embed/avatars/0.png";
        
        return string.Format(
            CultureInfo.InvariantCulture,
            "https://cdn.discordapp.com/avatars/{0}/{1}.{2}",
            user.GetString("id"),
            avatar,
            avatar.StartsWith("a_") ? "gif" : "png");
    });
});
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

var app = builder.Build();

app.MapHub<QuizHub>("/quizHub");
app.MapControllers();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseCookiePolicy(new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Lax
});
app.Run();