
function timeoutIterator( callback, timeout )
{
	this.callback = callback;
	this.timeout = timeout;
	
	this._timeout = null;
}

timeoutIterator.prototype = {
	setTimeout: function( time )
	{
		this.timeout = time;
	},
	setCallback: function( callback )
	{
		this.callback = callback;
	},
	trigger: function() { 
		this.cancel();		
		this._timeout = setTimeout( this.callback, this.timeout );
		
	},
	cancel: function()
	{
		if( this._timeout ){
			clearTimeout( this._timeout );
			this._timeout = null;
		}
	}
};
