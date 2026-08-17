import asyncio
import os
import sys
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 1800})
        
        print("Navigating to http://localhost:8080")
        await page.goto("http://localhost:8080", wait_until="networkidle")
        
        print("Page loaded. Looking for 'प्रमुख पदाधिकारी'")
        try:
            await page.wait_for_selector("text=प्रमुख पदाधिकारी", timeout=5000)
            print("Found heading.")
        except Exception as e:
            print(f"Heading not found: {e}")
            # Dump page content for debugging
            content = await page.content()
            with open("/tmp/page_debug.html", "w") as f:
                f.write(content)
            await browser.close()
            return

        # Find the cards
        cards = await page.locator("div.grid > div.rounded-xl").all() # Based on common Card classes
        print(f"Found {len(cards)} cards in a grid.")
        
        # Or just find all images within the featured members section
        images = await page.locator("img").all()
        print(f"Found {len(images)} images total on page.")
        
        for i, img in enumerate(images):
            src = await img.get_attribute("src")
            alt = await img.get_attribute("alt")
            print(f"Image {i}: src={src}, alt={alt}")

        await page.screenshot(path="/tmp/browser/members_full.png")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
