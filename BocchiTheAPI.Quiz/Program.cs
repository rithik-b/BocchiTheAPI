using BocchiTheAPI.Quiz.Hubs;
using SurrealDB.Abstractions;
using SurrealDB.Configuration;
using SurrealDB.Driver.Rest;
using Orleans.Hosting;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
builder.Host.UseOrleans(siloBuilder => 
{
    siloBuilder.UseLocalhostClustering();
});
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(corsBuilder =>
    {
        corsBuilder.WithOrigins(builder.Configuration["WebApplicationUrl"]!);
    });
});

builder.Services.AddSignalR();

var cfg = Config.Create()
    .WithEndpoint("127.0.0.1:8000")
    .WithDatabase("bocchi")
    .WithNamespace("global")
    .WithBasicAuth("root", "root")
    .WithRest(insecure: true).Build();

var db = new DatabaseRest(cfg);

builder.Services.AddSingleton<IDatabase>(db);
builder.Services.AddSingleton(db);
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

var app = builder.Build();
app.MapHub<QuizHub>("/quizHub");
app.MapControllers();
app.UseCors();
app.Run();