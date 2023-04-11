namespace BocchiTheAPI.Common.Models;

public static class EpisodeUtils
{
    public static string GetEpisodeFromSource(string source)
        => source switch
        {
            "mv:op" => "op",
            "mv:ed1" => "ed1",
            "mv:ed2" => "ed2",
            "mv:ed3" => "ed3",
            _ => source.Replace("episode:", "")
        };
    
    public static string? GetSourceFromNormalizedEpisode(string? normalizedEpisode)
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