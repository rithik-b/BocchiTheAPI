namespace BocchiTheAPI.Abstractions.Models;


[GenerateSerializer]
public record BocchiFrame(string id, Guid identifier, string source, int timestamp);