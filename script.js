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

  elements.prompt.addEventListener('input', function(){
    elements.prompt.style.height = 'auto';
    let newHeight = elements.prompt.scrollHeight;
    if(newHeight > 200){
      newHeight = 200;
    }
    elements.prompt.style.height = newHeight+'px';
  });

  elements.composer.addEventListener('su')
})
