document.addEventListener('DOMContentLoaded', function(){
  let elements = {
    clearChatBtn: document.getElementById('clearChatBtn'),
    messages: document.getElementById('messages'),
    composer: document.getElementById('composer'),
    prompt: document.getElementById('prompt'),
    sendBtn: document.getElementById('sendBtn'),
    modelSelect: document.getElementById('modeloSelect')
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

  elements.composer.addEventListener('submit', function(e){
    e.preventDefault();
    let text = elements.prompt.value;
    if(text){
      text = text.trim();
    }
    if(!text){
      return;
    }

    if(!API_KEY){
      alert('Configura tu API Key');
      return;
    }

    let model = elements.modelSelect.value;
    if(!model){
      model = DEFAULT_MODEL;
    }

    appendMessage('user', text, false);
    elements.prompt.value = '';
    elements.prompt.style.height = 'auto';

    setSendingState(true);

    generateContent(API_KEY, model, conversation, function(error, replyText){
      if(error){
        appendMessage('model', 'Error:'+error, true);
      }
      else{
        appendMessage('model', replyText, false);
      }
      setSendingState(false);
    });
  });

  function setSendingState(isSending){
    elements.sendBtn.disabled = isSending;
    elements.prompt.disabled = isSending;
  }

  function appendMessage( role, text, isError ){
    conversation.push({ role, parts: [{ text }]});
    renderMessages(isError ? (conversation.length - 1) : null, isError);
    scrollToBottom();
  }

  function renderMessages(errorIndex, isError){
    elements.messages.innerHTML = '';
    
  }
})
