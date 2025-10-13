async function consultarBCV(origen, destino) {
  return {
    origen,
    destino,
    tasa: 36.5,
    fecha: new Date().toISOString(),
    fuente: 'BCV'
  };
}

async function consultarBinance(origen, destino) {
  return {
    origen,
    destino,
    tasa: 36.7,
    fecha: new Date().toISOString(),
    fuente: 'Binance'
  };
}

module.exports = {
  consultarBCV,
  consultarBinance
};
