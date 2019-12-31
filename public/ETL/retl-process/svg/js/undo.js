
(function () {
	var ctor = function ctor() {};
	var inherits = function inherits(parent, protoProps) {
		var child;

		if (protoProps && protoProps.hasOwnProperty('constructor')) {
			child = protoProps.constructor;
		} else {
			child = function child() {
				return parent.apply(this, arguments);
			};
		}

		ctor.prototype = parent.prototype;
		child.prototype = new ctor();

		if (protoProps) extend(child.prototype, protoProps);

		child.prototype.constructor = child;
		child.__super__ = parent.prototype;
		return child;
	};

	function extend(target, ref) {
		var name, value;
		for (name in ref) {
			value = ref[name];
			if (value !== undefined) {
				target[name] = value;
			}
		}
		return target;
	};

	var Undo = {
		version: '0.1.15'
	};

	Undo.Stack = function () {
		this.commands = [];
		this.stackPosition = -1;
		this.savePosition = -1;
	};

	extend(Undo.Stack.prototype, {
		execute: function execute(command) {
			this._clearRedo();
			command.execute();
			this.commands.push(command);
			this.stackPosition++;
			this.changed();
		},
		undo: function undo() {
			this.commands[this.stackPosition].undo();
			this.stackPosition--;
			this.changed();
		},
		canUndo: function canUndo() {
			return this.stackPosition >= 0;
		},
		redo: function redo() {
			this.stackPosition++;
			this.commands[this.stackPosition].redo();
			this.changed();
		},
		canRedo: function canRedo() {
			return this.stackPosition < this.commands.length - 1;
		},
		save: function save() {
			this.savePosition = this.stackPosition;
			this.changed();
		},
		dirty: function dirty() {
			return this.stackPosition != this.savePosition;
		},
		_clearRedo: function _clearRedo() {
			// TODO there's probably a more efficient way for this
			this.commands = this.commands.slice(0, this.stackPosition + 1);
		},
		changed: function changed() {
			// do nothing, override
		}
	});

	Undo.Command = function (name) {
		this.name = name;
	};

	var up = new Error("override me!");

	extend(Undo.Command.prototype, {
		execute: function execute() {
			throw up;
		},
		undo: function undo() {
			throw up;
		},
		redo: function redo() {
			this.execute();
		}
	});

	Undo.Command.extend = function (protoProps) {
		var child = inherits(this, protoProps);
		child.extend = Undo.Command.extend;
		return child;
	};

	// AMD support
	if (typeof define === "function" && define.amd) {
		// Define as an anonymous module
		define(Undo);
	} else if (typeof module != "undefined" && module.exports) {
		module.exports = Undo;
	} else {
		this.Undo = Undo;
	}
}).call(undefined);