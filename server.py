import asyncio
import datetime
import random

import websockets


async def hello(websocket, path):
    while True:
        await asyncio.sleep(0.1)
        await websocket.send(f"{random.random()}")


start_server = websockets.serve(hello, "localhost", 8765)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
