// reward structure
rewards "messages_until_A_knows"
	[receiveA] kB & !kA : 1;
	[receiveB] kB & !kA : 1;
endrewards
