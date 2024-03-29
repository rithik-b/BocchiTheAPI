using BocchiTheAPI.Quiz.Grains.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace BocchiTheAPI.Quiz.Hubs;

public class QuizHub : Hub
{
    private readonly IClusterClient _client;
    private readonly ConnectedPlayersManager _connectedPlayersManager;
    
    public QuizHub(IClusterClient client, ConnectedPlayersManager connectedPlayersManager)
    {
        _client = client;
        _connectedPlayersManager = connectedPlayersManager;
    }

    public async Task JoinRoom(Guid roomId)
    {
        if (Context.User?.Identity?.IsAuthenticated != true)
            throw new HubException("You must be authenticated to join a room");
        
        _connectedPlayersManager.JoinRoom(Context.ConnectionId, roomId);
        var grain = _client.GetGrain<IBocchiQuizGrain>(roomId);
        grain.Join(Utils.GenerateUserFromClaimsPrincipal(Context.User));
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId.ToString());
        await Clients.Group(roomId.ToString()).SendAsync("InvalidateUsers");
    }
    
    public async Task LeaveRoom()
    {
        if (Context.User?.Identity?.IsAuthenticated != true)
            throw new HubException("You must be authenticated to leave a room");
        
        var roomId = _connectedPlayersManager.LeaveRoom(Context.ConnectionId);
        var grain = _client.GetGrain<IBocchiQuizGrain>(roomId);
        grain.Leave(Utils.GenerateUserFromClaimsPrincipal(Context.User));
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId.ToString());
        await Clients.Group(roomId.ToString()).SendAsync("InvalidateUsers");
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await LeaveRoom();
        await base.OnDisconnectedAsync(exception);
    }

    public async Task UpdateAnswer(Guid roomId, string answer)
    {
        if (Context.User?.Identity?.IsAuthenticated != true)
            throw new HubException("You must be authenticated to update your answer");
        
        var grain = _client.GetGrain<IBocchiQuizGrain>(roomId);
        grain.UpdateAnswer(Utils.GenerateUserFromClaimsPrincipal(Context.User), answer);
    }
}