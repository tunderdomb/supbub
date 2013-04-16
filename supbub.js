!function( win, doc, host ){

  /* PUB SUB */

  function Channel( name, firstlistener ){
    this.name = name
    this.length = 0
    firstlistener && this.push(firstlistener)
  }
  Channel.prototype = []
  Channel.prototype.publish = function ( message ){
    for ( var i = -1, l = this.length; ++i < l; ) {
      this[i].apply(null, message)
    }
  }
  Channel.prototype.subscribe = function ( listener ){
    var empty
    for ( var i = -1, l = this.length; ++i < l; ) {
      if ( this[i] == listener ) return i
      if( !this[i] ) empty = i
    }
    return empty
      ? this[empty] = listener
      : this.push(listener)-1
  }
  Channel.prototype.unsubscribe = function ( listener ){
    if( typeof listener == "function" ){
      for ( var i = -1, l = this.length; ++i < l; ){
        if ( this[i] == listener ) {
          // delete to keep numbering so the listener can be referenced with id
          delete this[i]
          return
        }
      }
    }
    // is a number
    else delete this[listener]
  }

  function Station(){
    this.channels = {}
  }
  Station.prototype = {
    addChannel: function( name ){
      return this[name] || (this[name] = new Channel(name))
    },
    removeChannel: function( name ){
      return delete this[name]
    },
    subscribe: function ( channel, listener ){
      var ch, i = -1
      if( typeof channel == "string" ){
        if ( this[channel] ) {
          return this[channel].subscribe(listener)
        }
        else this[channel] = new Channel(channel, listener)
        return 0
      }
      else {
        while( ch = channel[++i] ){
          if ( this[ch] ) {
            this[ch].subscribe(listener)
          }
          else this[ch] = new Channel(ch, listener)
        }
      }
    },
    unsubscribe: function ( channel, listener ){
      this[channel].unsubscribe(listener||channel)
    },
    publish: function ( channel ){
      this[channel] && this[channel].publish([].splice.call(arguments, 1))
    }
  }

  function supbub(){
    return new Station()
  }

  host.supbub = supbub
  host.supbub.Station = Station
}(window, document, this);