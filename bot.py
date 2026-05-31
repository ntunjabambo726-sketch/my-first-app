from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import MetaTrader5 as mt5

app = FastAPI()

# Allows your GitHub Pages website to securely talk to this backend script
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TradeRequest(BaseModel):
    action: str
    symbol: str
    volume: float

@app.on_event("startup")
def startup_event():
    # Connects to MetaTrader 5 terminal on launch
    if not mt5.initialize():
        print("MT5 Initialization failed")
        mt5.shutdown()

@app.get("/")
def home():
    return {"status": "Bot is online and connected to MetaTrader"}

@app.post("/trade")
def execute_trade(trade: TradeRequest):
    """Receives commands from your mobile app button"""
    action = trade.action.upper()
    order_type = mt5.ORDER_TYPE_BUY if action == "BUY" else mt5.ORDER_TYPE_SELL
    tick = mt5.symbol_info_tick(trade.symbol)
    if tick is None:
        raise HTTPException(status_code=400, detail="Symbol not found")

    price = tick.ask if order_type == mt5.ORDER_TYPE_BUY else tick.bid

    request = {
        "action": mt5.TRADE_ACTION_DEAL,
        "symbol": trade.symbol,
        "volume": trade.volume,
        "type": order_type,
        "price": price,
        "deviation": 20,
        "magic": 123456,
        "comment": "Sent from Maritime Profit App",
        "type_time": mt5.ORDER_TIME_GTC,
        "type_filling": mt5.ORDER_FILLING_IOC,
    }

    result = mt5.order_send(request)
    if result.retcode != mt5.TRADE_RETCODE_DONE:
        raise HTTPException(status_code=400, detail=f"Trade failed: {result.comment}")

    return {"status": "Success", "order_id": result.order}
