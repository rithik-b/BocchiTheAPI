namespace BocchiTheAPI.Quiz.Models;

public class UserState
{
    public int Score { get; set; }
    public string? Answer { get; set; }
    public bool HasImageLoaded { get; set; }
}