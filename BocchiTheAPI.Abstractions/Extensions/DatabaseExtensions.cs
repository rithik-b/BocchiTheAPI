using BocchiTheAPI.Abstractions.Models;
using SurrealDB.Abstractions;
using SurrealDB.Models.Result;

namespace BocchiTheAPI.Abstractions.Extensions;

public static class DatabaseExtensions
{
    public static async Task<BocchiFrame?> GetFrame(this IDatabase db, string? normalizedEpisode, CancellationToken cancellationToken)
    {
        await db.Open(cancellationToken);
        var source = GetSourceFromNormalizedEpisode(normalizedEpisode);
        var query = await db.Query($"SELECT * FROM frame{(source == null ? "" : " WHERE source = $source")} ORDER BY rand() LIMIT 1;", new Dictionary<string, object?> {{ "source", source }}, cancellationToken);
        if (!query.TryGetFirstValue(out var res)) return null;
        var frame = res.GetObject<BocchiFrame>();
        return frame;
    }
    
    private static string? GetSourceFromNormalizedEpisode(string? normalizedEpisode)
    => normalizedEpisode switch
    {
        null => null,
        "op" => "mv:op",
        "ed1" => "mv:ed1",
        "ed2" => "mv:ed2",
        "ed3" => "mv:ed3",
        _ => $"episode:{normalizedEpisode}"
    };
}