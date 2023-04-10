using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using SurrealDB.Abstractions;
using SurrealDB.Configuration;
using SurrealDB.Driver.Rest;

try
{
    using IHost host = await StartSiloAsync();
    Console.WriteLine("\n\n Press Enter to terminate...\n\n");
    Console.ReadLine();

    await host.StopAsync();

    return 0;
}
catch (Exception ex)
{
    Console.WriteLine(ex);
    return 1;
}

static async Task<IHost> StartSiloAsync()
{
    var builder = new HostBuilder()
        .UseOrleans(silo =>
        {
            silo.UseLocalhostClustering()
                .ConfigureLogging(logging => logging.AddConsole());
        });
    
    builder.ConfigureServices(services =>
    {
        var cfg = Config.Create()
            .WithEndpoint("127.0.0.1:8000")
            .WithDatabase("bocchi")
            .WithNamespace("global")
            .WithBasicAuth("root", "root")
            .WithRest(insecure: true).Build();

        var db = new DatabaseRest(cfg);

        services.AddSingleton<IDatabase>(db);
        services.AddSingleton(db);
    });
    
    var host = builder.Build();
    await host.StartAsync();

    return host;
}