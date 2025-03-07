import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService, ChatMessage } from '../services/chat.service';

@Component({
  selector: 'app-chat-widget',
  templateUrl: './chat-widget.component.html',
  styleUrl: './chat-widget.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ChatWidgetComponent implements OnInit {
  messages: ChatMessage[] = [{
    text: 'Hello! How can I help you?',
    timestamp: new Date().toISOString(),
    isUser: false
  }];
  inputMessage = '';
  isLoading = false;
  error: string | null = null;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {}

  async sendMessage(): Promise<void> {
    if (!this.inputMessage.trim() || this.isLoading) return;

    const newMessage: ChatMessage = {
      text: this.inputMessage,
      timestamp: new Date().toISOString(),
      isUser: true
    };

    this.messages.push(newMessage);
    const currentMessage = this.inputMessage;
    this.inputMessage = '';
    this.isLoading = true;
    this.error = null;

    try {
      const response = await this.chatService.sendMessage(currentMessage).toPromise();

      this.messages.push({
        text: response.answer,
        timestamp: new Date().toISOString(),
        isUser: false
      });
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Erro ao conectar com o servidor';
      this.messages.pop();
    } finally {
      this.isLoading = false;
    }
  }
}
