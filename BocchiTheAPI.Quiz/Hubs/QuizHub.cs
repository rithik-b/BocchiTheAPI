using BocchiTheAPI.Common;
using BocchiTheAPI.Quiz.Grains.Interfaces;
using BocchiTheAPI.Quiz.Models;
using Microsoft.AspNetCore.SignalR;

namespace BocchiTheAPI.Quiz.Hubs;

public class QuizHub : Hub
{
    private readonly IClusterClient _client;
    
    public QuizHub(IClusterClient client)
    {
        _client = client;
    }

    public async Task JoinRoom(Guid roomId)
    {
        if (Context.User?.Identity?.IsAuthenticated != true)
            throw new HubException("You must be authenticated to join a room");
        
        var grain = _client.GetGrain<IBocchiQuizGrain>(roomId);
        grain.Join(Utils.GenerateUserFromClaimsPrincipal(Context.User));
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId.ToString());
        await Clients.Group(roomId.ToString()).SendAsync("InvalidateUsers");
    }
    
    public async Task LeaveRoom(Guid roomId)
    {
        if (Context.User?.Identity?.IsAuthenticated != true)
            throw new HubException("You must be authenticated to leave a room");
        
        var grain = _client.GetGrain<IBocchiQuizGrain>(roomId);
        grain.Leave(Utils.GenerateUserFromClaimsPrincipal(Context.User));
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId.ToString());
        await Clients.Group(roomId.ToString()).SendAsync("InvalidateUsers");
    }

    public async Task UpdateAnswer(string answer)
    {
        if (Context.User?.Identity?.IsAuthenticated != true)
            throw new HubException("You must be authenticated to update your answer");
        
        var roomId = Guid.Parse(Context.GetHttpContext()!.Request.Query["roomId"]);
        var grain = _client.GetGrain<IBocchiQuizGrain>(roomId);
        grain.UpdateAnswer(Utils.GenerateUserFromClaimsPrincipal(Context.User), answer);
    }
}