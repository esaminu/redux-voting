import Server from 'socket.io';

export const startServer = (store) => {
  const io = new Server().attach(8090);

  store.subscribe(()=>{
    const state = store.getState().toJS();
    io.emit('state',state);
  });

  io.on('connection',(socket)=>{
    const state = store.getState().toJS();
    socket.emit('state',state);
    socket.on('action',store.dispatch.bind(store));
  });
}
