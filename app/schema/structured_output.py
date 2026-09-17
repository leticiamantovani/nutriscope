from pydantic import BaseModel

class StructuredOutput(BaseModel):
   foods: list[str]
   explanation: str