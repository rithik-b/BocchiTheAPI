using System.Collections.Concurrent;

namespace BocchiTheAPI.Quiz;

public class ConnectedPlayersManager
{
    private readonly ConcurrentDictionary<string, Guid> PlayersToRooms = new();
    
    public void JoinRoom(string connectionId, Guid roomId)
    {
        PlayersToRooms.TryAdd(connectionId, roomId);
    }
    
    public Guid LeaveRoom(string connectionId)
    {
        PlayersToRooms.TryRemove(connectionId, out var roomId);
        return roomId;
    }
}