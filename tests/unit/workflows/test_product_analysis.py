import unittest

from app.workflow_executor.streaming import serialize_state


class TestProductAnalysisStreaming(unittest.TestCase):
    def test_serializes_only_client_product_fields(self) -> None:
        state = {
            "product": {
                "code": "123",
                "name": "Example",
                "brands": "Brand",
                "url": "https://example.com",
                "nova_group": 4,
                "nutriscore_grade": "d",
                "ingredients_text": "Secret internal prompt data",
            }
        }

        result = serialize_state(state)

        self.assertNotIn("ingredients_text", result["product"])
        self.assertEqual(result["product"]["code"], "123")
