  function SendForm(form, action){
    this.form = form;
    this.action = action;
    this.message = {
      loading: false,
      progress: false,
      status: false,
      button: false
    };
    this.translation = {
      error_of_sending: "Error of sending form",
      upload_failed: "Upload is failed",
      upload_aborted: "Upload is aborted",
      ok: "OK"
    }

    this.init = function(){
      var self = this;
      this.createMessage();
    }

    this.init();
  }

  SendForm.prototype.createMessage = function(){
    var self = this;
    this.message.loading = document.createElement('div');
    this.message.loading.id = "loading";
    this.message.loading.style.display = "none";

    var load_wrap = document.createElement('div');
    load_wrap.id = "load_wrap";

    this.message.status = document.createElement('div');
    this.message.status.id = "status";

    this.message.progress = document.createElement('progress');
    this.message.progress.id = "progress";

    this.message.button = document.createElement('button');
    this.message.button.id = "ok";
    this.message.button.innerHTML = self.translation.ok;
    this.message.button.style.display = "none";

    load_wrap.appendChild(this.message.progress);
    load_wrap.appendChild(this.message.status);
    load_wrap.appendChild(this.message.button);

    this.message.loading.appendChild(load_wrap);
    document.body.appendChild(this.message.loading);

    this.message.button.addEventListener('click', function(event){
      self.message.loading.style.display = "flex";
    });
  }

  SendForm.prototype.sendForm = function(form, action, cb, options){
    var self = this;

    this.message.loading.style.display = "flex";
    this.message.progress.style.display = "block";

    var formdata = new FormData(form);
    var ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", function(event){self.__progressHandler(event, self)}, false);
    ajax.addEventListener("load", function(event){self.__completeHandler(event, self, cb, options)}, false);
    ajax.addEventListener("error", self.__errorHandler, false);
    ajax.addEventListener("abort", self.__abortHandler, false);
    ajax.open("POST", action, true);
    ajax.send(formdata);
  }

  SendForm.prototype.__progressHandler = function(event, self){
    //_("loaded_n_total").innerHTML = "Uploaded "+event.loaded+" bytes of "+event.total;
    var percent = (event.loaded / event.total) * 100;
    if(self.message.progress){
      self.message.progress.value = Math.round(percent);
      self.message.progress.innerHTML = Math.round(percent) + '%';
    }
  }

  SendForm.prototype.__showUploadingMessage = function(self, type, message){
    self.message.status = message;
    if(type == 'error'){
      self.message.button.style.display = "block";
    } else if(type == "success"){
      self.message.button.style.display = "none";
      self.message.loading.style.display = "none";
    }
  }

  SendForm.prototype.__completeHandler = function(event, self, cb, options){
    var response = JSON.parse(event.target.responseText);

    if(response.type == undefined ){
      self.__showUploadingMessage('error', self.translation.error_of_uploading);
      return;
    } else if(response.type == "error"){
      self.__showUploadingMessage('error', response[i].text);
      return;
    } else {
      self.message.progress.value = 0;
      self.message.progress.style.display = "none";

      if(cb){
        cb(options);
      }

    }
  }

  SendForm.prototype.__errorHandler = function(event, self){
    self.message.status.innerHTML = self.translation.upload_failed;
  }

  SendForm.prototype.__abortHandler = function(event, self){
    self.message.status.innerHTML = self.translation.upload_aborted;
  }
