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
    let i = 0;
    while( i < conversation.length){
      let msg = conversation[i];

      let wrapper = document.createElement('div');
      wrapper.className = 'message ' + (msg.role === 'user' ? 'user' : 'model');

      let avatar = document.createElement('div');
      avatar.className = 'avatar';
      avatar.textContent = msg.role === 'user' ? 'Tú' : 'G';

      let bubble = document.createElement('div');
      bubble.className = 'bubble';
      if(isError && i === errorIndex)
        bubble.className += ' error';

      let bubbleText = '';
      if(msg && msg.parts && msg.parts[0] && msg.parts[0].text){
        bubbleText = msg.parts[0].text;
      }
      bubble.textContent = bubbleText;

      wrapper.appendChild(avatar);
      wrapper.appendChild(bubble);
      elements.messages.appendChild(wrapper);

      i++;
    }
  }

  function scrollToBottom(){
    elements.messages.scrollTop = elements.messages.scrollHeight;
  }

  function generateContent(apiKey, model, contents, callback){
    let url = 'https://generativelanguage.googleapis.com/v1beta/models/' +
    encodeURIComponent(model) + ':generateContent?key=' + encodeURIComponent(apiKey);

    let payload = { contents };

    let xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          let data;
          try {
            data = JSON.parse(xhr.responseText);
          } catch (e) {
            callback('Respuesta no es JSON válido', null);
            return;
          }

          let text = '';
          if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
            text = data.candidates[0].content.parts[0].text;
          }
          callback(null, text);
        } else {
          let errorMsg = 'HTTP ' + xhr.status;
          try {
            let errData = JSON.parse(xhr.responseText);
            if (errData && errData.error && errData.error.message) {
              errorMsg += ': ' + errData.error.message;
            }
          } catch (e) {}
          callback(errorMsg, null);
        }
      }
    };

    xhr.send(JSON.stringify(payload));
  }
})

