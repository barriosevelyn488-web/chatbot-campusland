document.addEventListener('DOMContentLoaded', function(){
  let elements = {
    clearChatBtn: document.getElementById('clearChatBtn'),
    messages: document.getElementById('messages'),
    composer: document.getElementById('composer'),
    prompt: document.getElementById('prompt'),
    sendBtn: document.getElementById('sendBtn')
  }

  const API_KEY = '';
  const DEFAULT_MODEL = 'gemini-2.5-flash';
  let conversation = [];

  elements.clearChatBtn.addEventListener('click', function(){
    const confirmDelete = confirm('¿Borrar toda la conversación?');
    if(!confirmDelete) return;
    conversation = [];
    renderMessages();
  });
})
