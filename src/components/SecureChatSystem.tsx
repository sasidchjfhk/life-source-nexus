import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Send, 
  Shield, 
  Users, 
  Phone, 
  Video,
  Paperclip,
  MoreVertical,
  Search,
  Lock,
  Clock,
  Check,
  CheckCheck
} from "lucide-react";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'doctor' | 'nurse' | 'coordinator' | 'admin';
  content: string;
  timestamp: string;
  encrypted: boolean;
  delivered: boolean;
  read: boolean;
  attachments?: string[];
}

interface ChatRoom {
  id: string;
  name: string;
  type: 'direct' | 'team' | 'emergency';
  participants: Array<{
    id: string;
    name: string;
    role: string;
    online: boolean;
    avatar?: string;
  }>;
  lastMessage?: ChatMessage;
  unreadCount: number;
  priority: 'normal' | 'high' | 'critical';
}

const SecureChatSystem = () => {
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});

  useEffect(() => {
    initializeChatData();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeRoom]);

  const initializeChatData = () => {
    const mockRooms: ChatRoom[] = [
      {
        id: 'room1',
        name: 'Kidney Transplant Team',
        type: 'team',
        participants: [
          { id: 'u1', name: 'Dr. Sarah Johnson', role: 'Surgeon', online: true, avatar: '' },
          { id: 'u2', name: 'Nurse Patricia Lee', role: 'Coordinator', online: true, avatar: '' },
          { id: 'u3', name: 'Dr. Michael Chen', role: 'Anesthesiologist', online: false, avatar: '' }
        ],
        unreadCount: 3,
        priority: 'high'
      },
      {
        id: 'room2',
        name: 'Emergency Response',
        type: 'emergency',
        participants: [
          { id: 'u4', name: 'Dr. Emily Rodriguez', role: 'Emergency', online: true, avatar: '' },
          { id: 'u5', name: 'John Smith', role: 'Coordinator', online: true, avatar: '' }
        ],
        unreadCount: 1,
        priority: 'critical'
      },
      {
        id: 'room3',
        name: 'Dr. Sarah Johnson',
        type: 'direct',
        participants: [
          { id: 'u1', name: 'Dr. Sarah Johnson', role: 'Surgeon', online: true, avatar: '' }
        ],
        unreadCount: 0,
        priority: 'normal'
      }
    ];

    const mockMessages: Record<string, ChatMessage[]> = {
      room1: [
        {
          id: 'm1',
          senderId: 'u1',
          senderName: 'Dr. Sarah Johnson',
          senderRole: 'doctor',
          content: 'Patient prep completed. Ready for procedure in 30 minutes.',
          timestamp: new Date(Date.now() - 600000).toISOString(),
          encrypted: true,
          delivered: true,
          read: true
        },
        {
          id: 'm2',
          senderId: 'u2',
          senderName: 'Nurse Patricia Lee',
          senderRole: 'nurse',
          content: 'All consent forms signed. Donor is stable and ready.',
          timestamp: new Date(Date.now() - 300000).toISOString(),
          encrypted: true,
          delivered: true,
          read: true
        },
        {
          id: 'm3',
          senderId: 'u3',
          senderName: 'Dr. Michael Chen',
          senderRole: 'doctor',
          content: 'Anesthesia plan reviewed. Patient has no allergies.',
          timestamp: new Date(Date.now() - 120000).toISOString(),
          encrypted: true,
          delivered: true,
          read: false
        }
      ],
      room2: [
        {
          id: 'm4',
          senderId: 'u4',
          senderName: 'Dr. Emily Rodriguez',
          senderRole: 'doctor',
          content: 'URGENT: Critical patient incoming. Need immediate organ match.',
          timestamp: new Date(Date.now() - 60000).toISOString(),
          encrypted: true,
          delivered: true,
          read: false
        }
      ],
      room3: []
    };

    setRooms(mockRooms);
    setMessages(mockMessages);
    setActiveRoom('room1');
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !activeRoom) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: 'current-user',
      senderName: 'You',
      senderRole: 'coordinator',
      content: newMessage,
      timestamp: new Date().toISOString(),
      encrypted: true,
      delivered: false,
      read: false
    };

    setMessages(prev => ({
      ...prev,
      [activeRoom]: [...(prev[activeRoom] || []), message]
    }));

    setNewMessage("");

    // Simulate message delivery
    setTimeout(() => {
      setMessages(prev => ({
        ...prev,
        [activeRoom]: prev[activeRoom].map(m => 
          m.id === message.id ? { ...m, delivered: true } : m
        )
      }));
    }, 1000);

    toast({
      title: "Message sent",
      description: "Your encrypted message has been delivered.",
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'doctor':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'nurse':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'coordinator':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'border-l-red-500 bg-red-50 dark:bg-red-950/20';
      case 'high':
        return 'border-l-orange-500 bg-orange-50 dark:bg-orange-950/20';
      default:
        return 'border-l-gray-300 bg-background';
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.participants.some(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const activeRoomData = rooms.find(r => r.id === activeRoom);
  const roomMessages = activeRoom ? messages[activeRoom] || [] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[800px]">
      {/* Chat Rooms List */}
      <Card className="lg:col-span-1">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Secure Chat
            <Badge variant="outline" className="ml-auto">
              <Shield className="h-3 w-3 mr-1" />
              E2E
            </Badge>
          </CardTitle>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[600px]">
            {filteredRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setActiveRoom(room.id)}
                className={`p-4 border-l-4 cursor-pointer transition-colors hover:bg-secondary/50 ${
                  activeRoom === room.id ? getPriorityColor(room.priority) : 'border-l-transparent'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{room.name}</h4>
                    {room.type === 'emergency' && (
                      <Badge variant="destructive" className="text-xs">
                        Emergency
                      </Badge>
                    )}
                  </div>
                  {room.unreadCount > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                      {room.unreadCount}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-1 mb-2">
                  {room.participants.slice(0, 3).map(participant => (
                    <div key={participant.id} className="flex items-center">
                      <div className={`w-2 h-2 rounded-full mr-1 ${
                        participant.online ? 'bg-green-500' : 'bg-gray-400'
                      }`} />
                      <span className="text-xs text-muted-foreground">
                        {participant.name.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                  {room.participants.length > 3 && (
                    <span className="text-xs text-muted-foreground">
                      +{room.participants.length - 3}
                    </span>
                  )}
                </div>

                {room.lastMessage && (
                  <p className="text-xs text-muted-foreground truncate">
                    {room.lastMessage.content}
                  </p>
                )}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="lg:col-span-3">
        {activeRoomData ? (
          <>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {activeRoomData.name}
                    {activeRoomData.type === 'emergency' && (
                      <Badge variant="destructive">Emergency</Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {activeRoomData.participants.length} participants • 
                    {activeRoomData.participants.filter(p => p.online).length} online
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-col h-[650px]">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {roomMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === 'current-user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${
                        message.senderId === 'current-user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-secondary'
                      } rounded-lg p-3`}>
                        {message.senderId !== 'current-user' && (
                          <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs">
                                {message.senderName[0]}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{message.senderName}</span>
                            <Badge variant="outline" className={`text-xs ${getRoleColor(message.senderRole)}`}>
                              {message.senderRole}
                            </Badge>
                          </div>
                        )}
                        
                        <p className="text-sm">{message.content}</p>
                        
                        <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                          <div className="flex items-center gap-1">
                            {message.encrypted && (
                              <Lock className="h-3 w-3" />
                            )}
                            <Clock className="h-3 w-3" />
                            <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
                          </div>
                          
                          {message.senderId === 'current-user' && (
                            <div className="flex items-center gap-1">
                              {message.read ? (
                                <CheckCheck className="h-3 w-3 text-blue-500" />
                              ) : message.delivered ? (
                                <CheckCheck className="h-3 w-3" />
                              ) : (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <Separator />

              {/* Message Input */}
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Input
                    placeholder="Type your secure message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  End-to-end encrypted • Messages are automatically deleted after 30 days
                </p>
              </div>
            </CardContent>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">Select a conversation</h3>
              <p className="text-muted-foreground">Choose a chat room to start messaging</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default SecureChatSystem;