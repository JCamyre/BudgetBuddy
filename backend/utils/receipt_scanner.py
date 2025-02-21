"""
Donut
Copyright (c) 2022-present NAVER Corp.
MIT License

https://github.com/clovaai/donut
"""
import gradio as gr
import torch
from PIL import Image

from donut import DonutModel

class ReceiptScanner:
    def __init__(self):
        # Initialize the model with ignore_mismatched_sizes=True
        self.model = DonutModel.from_pretrained(
            "naver-clova-ix/donut-base-finetuned-cord-v2",
            ignore_mismatched_sizes=True
        )
        self.model.eval()
        self.task_prompt = "<s_cord-v2>"

    def scan_receipt(self, image_path):
        # Load and process the image
        image = Image.open(image_path)
        
        # Generate receipt information
        output = self.model.inference(
            image=image,
            prompt=self.task_prompt
        )["predictions"][0]
        
        return output

# Example usage:
# scanner = ReceiptScanner()
# result = scanner.scan_receipt("./receipt.jpg")
# print(result)