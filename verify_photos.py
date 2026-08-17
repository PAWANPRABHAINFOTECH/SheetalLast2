import asyncio
import os
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 1280, "height": 1800})
        
        # Navigate to homepage
        await page.goto("http://localhost:8080")
        
        # Wait for the FeaturedMembers section
        # "प्रमुख पदाधिकारी" is the heading
        await page.wait_for_selector("text=प्रमुख पदाधिकारी")
        
        # Take a screenshot of the members section
        members_section = page.locator("div:has(h2:has-text('प्रमुख पदाधिकारी')) + div")
        await members_section.screenshot(path="/tmp/browser/members_verification.png")
        
        # Check if images are loading
        images = await members_section.locator("img").all()
        for i, img in enumerate(images):
            src = await img.get_attribute("src")
            print(f"Image {i} src: {src}")
            # Check if it's one of our asset URLs
            if "/__l5e/assets-v1/" in src:
                print(f"Image {i} is a custom asset.")
            else:
                print(f"Image {i} is NOT a custom asset.")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
