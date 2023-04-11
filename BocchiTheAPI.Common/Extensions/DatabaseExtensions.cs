using BocchiTheAPI.Common.Models;
using SurrealDB.Abstractions;
using SurrealDB.Models.Result;

namespace BocchiTheAPI.Common.Extensions;

public static class DatabaseExtensions
{
    public static async Task<BocchiFrame?> GetFrame(this IDatabase db, string? normalizedEpisode, CancellationToken cancellationToken)
    {
        await db.Open(cancellationToken);
        var source = EpisodeUtils.GetSourceFromNormalizedEpisode(normalizedEpisode);
        var query = await db.Query($"SELECT * FROM frame{(source == null ? "" : " WHERE source = $source")} ORDER BY rand() LIMIT 1;", new Dictionary<string, object?> {{ "source", source }}, cancellationToken);
        if (!query.TryGetFirstValue(out var res)) return null;
        var frame = res.AsObject<BocchiFrame>();
        return frame;
    }
}