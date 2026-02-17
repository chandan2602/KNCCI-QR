import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
// If your build supports importing images, you can use a direct import statement.
// Otherwise, we will reference the asset path string directly below.
// import whatsappQR from 'src/assets/img/img/whatsapp-qr.png';

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.css']
})
export class ChatWidgetComponent implements AfterViewInit {
  isOpen = false;
  inputText = '';
  messages: Array<any> = [];
  private hasGreeted = false;

  whatsappLink = 'https://wa.me/916309963466';
  // Use the asset path so Angular serves it from the assets folder
  qrImageSrc: string = 'assets/img/img/whatsapp-qr.png';
  fullName: string = ((sessionStorage as any)['FullName'] || sessionStorage.getItem('FullName') || '').trim();

  // Dynamic greeting messages
  private greetingMessages = [
    "Hi there! I'm Shangazi AI – your smart assistant that connects people. I understand your needs, reach out to you, and help you connect with the right opportunities.",
    "Hey there! 👋 I'm Shangazi AI – here to bridge the gap between your ideas and the right people.",
    "Hello and welcome 👋 I'm Shangazi AI, a smart assistant designed to connect people with the right opportunities.",
    "Hi 👋 I'm Shangazi AI – the AI that connects people with opportunities!",
    "Hello 👋 I'm Shangazi AI. My role is to bridge the gap between your goals and the right opportunities.",
    "Hi 👋 Welcome to Shangazi AI. I specialize in gathering your requirements and connecting you with the right opportunities.",
    "Hi 👋 I'm Shangazi AI – the AI that transforms your skills and ideas into real opportunities. ✨",
    "Hello and welcome 👋 I'm Shangazi AI, designed to connect you with the right people and opportunities that matter. 🌐",
    "Hi 👋 Welcome to Shangazi AI – your smart connector for ideas, people, and opportunities. 🤝",
    "Hi 👋 Welcome to Shangazi AI – your smart partner for making connections.",
    "Hello and welcome 🚀 I'm Shangazi AI, built to connect people with the right matches.",
    "Hey 👋 I'm Shangazi AI, guiding you toward success.",
    "Welcome 👋 I'm Shangazi AI, your smart assistant for growth.",
    "Hi there! 👋 I'm Shangazi AI – your smart assistant to connect ideas with people. Let's find your opportunities! 🚀",
    "Welcome 👋 I'm Shangazi AI, designed to listen, understand, and connect you with the right people.",
    "Hello 🌟 I'm Shangazi AI – your bridge from ideas to investors, and from goals to opportunities.",
    "Hey there 👋 I'm Shangazi AI, here to guide your ideas into meaningful connections.",
    "Hi 👋 I'm Shangazi AI – built to understand your needs and connect you with the right people.",
    "Hello 👋 I'm Shangazi AI, your personal connector to skills, people, and opportunities.",
    "Welcome! 🌐 I'm Shangazi AI – here to turn your vision into real opportunities."
  ];

  // Dynamic WhatsApp messages
  private whatsappMessages = [
    "WhatsApp is way more fun 🎉 Let's continue our chat there – just tap below!",
    "🚀 Ready for a smoother chat? Let's switch to WhatsApp – click below!",
    "💬 Let's keep the conversation flowing on WhatsApp – tap below!",
    "🌟 Our chat gets even better on WhatsApp – join me there!",
    "🎊 Don't miss out – WhatsApp makes chatting easier. Just tap below!",
    "For quicker responses, let's move this chat to WhatsApp – click below.",
    "WhatsApp offers a seamless experience – continue our chat there!",
    "📱 Take our conversation to WhatsApp for a smoother experience.",
    "✨ Stay connected – tap below to continue on WhatsApp.",
    "👋 Let's carry on the discussion on WhatsApp – just one click away.",
    "🌈 Let's chat with more ease and speed on WhatsApp – click below!",
    "🎉 WhatsApp is where the magic happens – pick up our chat there!",
    "😃 Let's make it easy! Switch to WhatsApp by tapping below.",
    "🌟 Want instant updates? Join me on WhatsApp – tap below!",
    "🎊 WhatsApp is calling – let's pick up our chat there!",
    "✨ Switch to WhatsApp for faster replies – tap below!",
    "🚀 Let's move the chat to WhatsApp for a better experience.",
    "🎉 WhatsApp is just one click away – join me there!",
    "💬 Ready for quick and fun chats? Tap below for WhatsApp!",
    "🚀 Faster, smoother, better – let's chat on WhatsApp!"
  ];

  @ViewChild('messagesScroller') messagesScroller!: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') messageInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {}

  // Function to pick random message
  private getRandomMessage(messages: string[]): string {
    return messages[Math.floor(Math.random() * messages.length)];
  }

  private getPersonalizedGreeting(): string {
    const base = this.getRandomMessage(this.greetingMessages);
    if (!this.fullName) { return base; }
    if (base.indexOf('👋') !== -1) {
      return base.replace('👋', `👋 ${this.fullName},`);
    }
    return `Hi ${this.fullName}! ${base}`;
  }

  toggleOpen(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        if (this.messageInput) {
          this.messageInput.nativeElement.focus();
        }
        if (!this.hasGreeted) {
          this.messages.push({
            type: 'bot',
            template: 'text',
            text: this.getPersonalizedGreeting(),
            timestamp: new Date()
          });
          this.hasGreeted = true;
        }
        this.scrollToBottom();
      });
    }
  }

  handleSend(): void {
    const trimmed = (this.inputText || '').trim();
    if (!trimmed) { return; }

    // Append user message
    this.messages.push({ type: 'user', text: trimmed, timestamp: new Date() });

    // Clear input and scroll
    this.inputText = '';
    this.scrollToBottom();

    // Always reply with dynamic WhatsApp message
    setTimeout(() => {
      this.messages.push({
        type: 'bot',
        template: 'whatsapp',
        text: this.getRandomMessage(this.whatsappMessages),
        link: this.whatsappLink,
        qrSrc: this.qrImageSrc,
        timestamp: new Date()
      });
      this.scrollToBottom();
    }, 150);
  }

  // No fallback: ensure QR always uses the provided asset path

  private scrollToBottom(): void {
    try {
      if (this.messagesScroller && this.messagesScroller.nativeElement) {
        const el = this.messagesScroller.nativeElement;
        el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
      }
    } catch {}
  }
}


