(function (root) {

    function guidGenerator() {
        var S4 = function () {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        };
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    };

    function Subscriber(fn, options, context) {
        if (!this instanceof Subscriber) {
            return new Subscriber(fn, context, options);
        } else {
            this.id = guidGenerator();
            this.fn = fn;
            this.options = options;
            this.context = context;
            this.channel = null;
        }
    };

    Subscriber.prototype = {

        Update: function (options) {
            if (options) {
                this.fn = options.fn || this.fn;
                this.context = options.context || this.context;
                this.options = options.options || this.options;
                if (this.channel && this.options && this.options.priority != undefined) {
                    this.channel.SetPriority(this.id, this.options.priority);
                }
            }
        }
    };


    function Channel(namespace) {
        if (!this instanceof Channel) {
            return new Channel(namespace);
        } else {
            this.namespace = namespace || "";
            this._callbacks = [];
            this._channels = [];
            this.stopped = false;
        }
    };


    Channel.prototype = {
        AddSubscriber: function (fn, options, context) {
            var callback = new Subscriber(fn, options, context);

            if (options && options.priority !== undefined) {
                options.priority = options.priority >> 0;

                if (options.priority < 0) options.priority = 0;
                if (options.priority > this._callbacks.length) options.priority = this._callbacks.length;

                this._callbacks.splice(options.priority, 0, callback);
            } else {
                this._callbacks.push(callback);
            }

            callback.channel = this;

            return callback;
        },

        StopPropagation: function () {
            this.stopped = true;
        },

        GetSubscriber: function (identifier) {
            for (var x = 0, y = this._callbacks.length; x < y; x++) {
                if (this._callbacks[x].id == identifier || this._callbacks[x].fn == identifier) {
                    return this._callbacks[x];
                }
            }

            for (var z in this._channels) {
                if (this._channels.hasOwnProperty(z)) {
                    var sub = this._channels[z].GetSubscriber(identifier);
                    if (sub !== undefined) {
                        return sub;
                    }
                }
            }
        },

        SetPriority: function (identifier, priority) {
            var oldIndex = 0;

            for (var x = 0, y = this._callbacks.length; x < y; x++) {
                if (this._callbacks[x].id == identifier || this._callbacks[x].fn == identifier) {
                    break;
                }
                oldIndex++;
            }

            var sub = this._callbacks[oldIndex],
          firstHalf = this._callbacks.slice(0, oldIndex),
          lastHalf = this._callbacks.slice(oldIndex + 1);

            this._callbacks = firstHalf.concat(lastHalf);
            this._callbacks.splice(priority, 0, sub);

        },

        AddChannel: function (channel) {
            this._channels[channel] = new Channel((this.namespace ? this.namespace + ':' : '') + channel);
        },

        HasChannel: function (channel) {
            return this._channels.hasOwnProperty(channel);
        },

        ReturnChannel: function (channel) {
            return this._channels[channel];
        },

        // This will remove a subscriber recursively through its subchannels.

        RemoveSubscriber: function (identifier) {
            if (!identifier) {
                this._callbacks = [];

                for (var z in this._channels) {
                    if (this._channels.hasOwnProperty(z)) {
                        this._channels[z].RemoveSubscriber(identifier);
                    }
                }
            }

            for (var y = 0, x = this._callbacks.length; y < x; y++) {
                if (this._callbacks[y].fn == identifier || this._callbacks[y].id == identifier) {
                    this._callbacks[y].channel = null;
                    this._callbacks.splice(y, 1);
                    x--; y--;
                }
            }
        },

        // This will publish arbitrary arguments to a subscriber recursively
        // through its subchannels.

        Publish: function (data) {
            for (var y = 0, x = this._callbacks.length; y < x; y++) {
                if (!this.stopped) {
                    var callback = this._callbacks[y], l;

                    if (callback.options !== undefined && typeof callback.options.predicate === "function") {
                        if (callback.options.predicate.apply(callback.context, data)) {
                            callback.fn.apply(callback.context, data);
                        }
                    } else {
                        callback.fn.apply(callback.context, data);
                    }
                }

                l = this._callbacks.length;
                if (l < x) y--; x = l;
            }

            for (var x in this._channels) {
                if (!this.stopped) {
                    if (this._channels.hasOwnProperty(x)) {
                        this._channels[x].Publish(data);
                    }
                }
            }

            this.stopped = false;
        }
    };

    function Mediator() {
        if (!this instanceof Mediator) {
            return new Mediator();
        } else {
            this._channels = new Channel('');
        }
    };

    // A Mediator instance is the interface through which events are registered
    // and removed from publish channels.

    Mediator.prototype = {

        // Returns a channel instance based on namespace, for example
        // application:chat:message:received

        GetChannel: function (namespace) {
            var channel = this._channels;
            var namespaceHierarchy = namespace.split(':');

            if (namespace === '') {
                return channel;
            }

            if (namespaceHierarchy.length > 0) {
                for (var i = 0, j = namespaceHierarchy.length; i < j; i++) {

                    if (!channel.HasChannel(namespaceHierarchy[i])) {
                        channel.AddChannel(namespaceHierarchy[i]);
                    }

                    channel = channel.ReturnChannel(namespaceHierarchy[i]);
                }
            }

            return channel;
        },

        // Pass in a channel namespace, function to be called, options, and context
        // to call the function in to Subscribe. It will create a channel if one
        // does not exist. Options can include a predicate to determine if it
        // should be called (based on the data published to it) and a priority
        // index.

        Subscribe: function (channelName, fn, options, context) {
            var options = options || {},
          context = context || {},
          channel = this.GetChannel(channelName),
          sub = channel.AddSubscriber(fn, options, context);

            return sub;
        },

        // Returns a subscriber for a given subscriber id / named function and
        // channel namespace

        GetSubscriber: function (identifier, channel) {
            return this.GetChannel(channel || "").GetSubscriber(identifier);
        },

        // Remove a subscriber from a given channel namespace recursively based on
        // a passed-in subscriber id or named function.

        Remove: function (channelName, identifier) {
            this.GetChannel(channelName).RemoveSubscriber(identifier);
        },

        // Publishes arbitrary data to a given channel namespace. Channels are
        // called recursively downwards; a post to application:chat will post to
        // application:chat:receive and application:chat:derp:test:beta:bananas.
        // Called using Mediator.Publish("application:chat", [ args ]);

        Publish: function (channelName) {
            var args = Array.prototype.slice.call(arguments, 1),
          channel = this.GetChannel(channelName);

            args.push(channel);

            this.GetChannel(channelName).Publish(args);
        }
    };

    // Finally, expose it all.

    root.Mediator = Mediator;
    Mediator.Channel = Channel;
    Mediator.Subscriber = Subscriber;

})(typeof exports == "undefined" ? window : exports);