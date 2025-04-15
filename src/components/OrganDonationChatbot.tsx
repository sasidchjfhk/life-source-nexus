
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, Send, User, Bot, Loader2 } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    text: "Hello! I'm your AI assistant for organ donation information. How can I help you today?",
    sender: "bot",
    timestamp: new Date()
  }
];

// Mock AI responses for common organ donation questions
const AI_RESPONSES: Record<string, string> = {
  "what is organ donation": "Organ donation is the process of surgically removing an organ or tissue from one person (the donor) and placing it into another person (the recipient). Transplants can save or significantly improve the lives of those receiving them.",
  "who can donate": "Almost anyone, regardless of age, race, or gender, can become an organ donor. Whether or not you can donate depends on your physical condition, not your age. Newborns as well as senior citizens have been organ donors.",
  "how do i become a donor": "To become a donor, you can register with our blockchain platform by completing the donor registration form. You'll receive an NFT badge certifying your status. You should also inform your family about your decision.",
  "what organs can be donated": "The organs that can be donated include: kidneys, heart, liver, lungs, pancreas, and intestines. Tissues that can be donated include: cornea, skin, heart valves, bone, blood vessels, and connective tissue.",
  "is there an age limit": "There's no defined age limit for organ donation. The decision to use your organs is based on strict medical criteria, not age. Organs have been successfully transplanted from donors in their 70s and 80s.",
  "how does the matching work": "Our platform uses advanced AI algorithms to match donors with recipients. The matching considers blood type, tissue type, organ size, medical urgency, waiting time, and geographical location to ensure the best possible outcomes.",
  "is it safe": "Organ donation is safe and conducted by highly trained medical professionals. The donor's health and well-being are always prioritized, and all procedures follow strict medical protocols.",
  "how does blockchain help": "Blockchain technology ensures transparent, secure, and immutable records of all donation processes. It helps prevent fraud, ensures proper consent management, enables organ tracking, and helps with fair allocation of organs to recipients."
};

const OrganDonationChatbot = () => {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateResponse = (question: string): string => {
    const lowercaseQuestion = question.toLowerCase();
    
    // Check if we have a predefined answer
    for (const [key, value] of Object.entries(AI_RESPONSES)) {
      if (lowercaseQuestion.includes(key)) {
        return value;
      }
    }
    
    // Default response if no match found
    return "I don't have specific information about that yet. Please ask about organ donation, the donation process, eligibility, or how our blockchain system works.";
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);
    
    // Simulate AI processing time
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateResponse(input),
        sender: "bot",
        timestamp: new Date()
      };
      
      setMessages((prev) => [...prev, botResponse]);
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="w-full h-[500px] flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          Organ Donation AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-0">
        <ScrollArea className="h-[370px] p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div 
                  className={`flex gap-2 max-w-[80%] ${
                    message.sender === "user" 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted"
                  } rounded-lg p-3`}
                >
                  {message.sender === "bot" && (
                    <Bot className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {message.sender === "user" && (
                    <User className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="flex gap-2 max-w-[80%] bg-muted rounded-lg p-3">
                  <Bot className="h-5 w-5 flex-shrink-0 mt-0.5" />
                  <div className="flex items-center gap-1">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p className="text-sm">Thinking...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="pt-0">
        <div className="flex w-full gap-2">
          <Input
            placeholder="Ask about organ donation..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button 
            size="icon" 
            onClick={handleSend}
            disabled={!input.trim() || loading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default OrganDonationChatbot;
