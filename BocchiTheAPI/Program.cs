using Microsoft.OpenApi.Models;
using SurrealDB.Abstractions;
using SurrealDB.Configuration;
using SurrealDB.Driver.Rest;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddServer(new OpenApiServer
    {
        Url = builder.Configuration["ApiUrl"]
    });
});
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(corsBuilder =>
    {
        corsBuilder.WithOrigins(builder.Configuration["WebApplicationUrl"]!);
    });
    options.AddPolicy("AllowAll", corsBuilder =>
    {
        corsBuilder.AllowAnyOrigin();
        corsBuilder.AllowAnyMethod();
        corsBuilder.AllowAnyHeader();
    });
});

builder.Services.AddOrleansClient(b => b.UseLocalhostClustering());

var cfg = Config.Create()
    .WithEndpoint("127.0.0.1:8000")
    .WithDatabase("bocchi")
    .WithNamespace("global")
    .WithBasicAuth("root", "root")
    .WithRest(insecure: true).Build();

var db = new DatabaseRest(cfg);

builder.Services.AddSingleton<IDatabase>(db);
builder.Services.AddSingleton(db);

var app = builder.Build();

app.UseSwagger();
app.MapControllers();
app.UseStaticFiles();
app.UseCors();
app.Run();