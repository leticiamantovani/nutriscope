import json
import unittest

from app.api.formatters.sse import to_sse


class TestSseFormatter(unittest.TestCase):
    def test_formats_named_event(self) -> None:
        event = {"type": "done", "message": "Complete"}

        result = to_sse(event)

        payload = json.dumps(event, ensure_ascii=False)
        self.assertEqual(result, f"event: done\ndata: {payload}\n\n")
