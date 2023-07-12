namespace BocchiTheAPI.Quiz.Models;

[GenerateSerializer]
public record User(string id, string name, string discriminator, string avatarUrl);