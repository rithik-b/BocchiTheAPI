using Microsoft.OpenApi.Models;

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
        corsBuilder.AllowAnyOrigin();
        corsBuilder.AllowAnyHeader();
        corsBuilder.AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseSwagger();
app.MapControllers();
app.UseStaticFiles();
app.UseCors();
app.Run();