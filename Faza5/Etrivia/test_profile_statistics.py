from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import unittest


#Uroš Rajčić 2021/0540
class ProfileStatisticsTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome()
        self.driver.get("http://localhost:8000/etrivia/login")  # Replace with your login URL if different

    def test_profile_statistics(self):
        driver = self.driver

        # Log in
        username = driver.find_element(By.NAME, "username")
        password = driver.find_element(By.NAME, "password")
        login_button = driver.find_element(By.CSS_SELECTOR, "input.submit-button")

        username.send_keys("rajciic")
        password.send_keys("Etrivia123")
        login_button.click()

        # Wait until login completes and main page loads
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "icon"))
            )
            print("Main icon found.")
        except Exception as e:
            print("Failed to find the main icon: ", e)
            driver.save_screenshot('main_icon_not_found.png')
            raise

        # Open the menu by clicking the div with the 'container' class inside the 'icon' element
        try:
            icon_element = driver.find_element(By.CLASS_NAME, "icon")
            print("Icon element found.")
            container_div = icon_element.find_element(By.CLASS_NAME, "container")
            driver.execute_script("arguments[0].click();", container_div)
            print("Container div clicked.")
        except Exception as e:
            print("Failed to find or click the container div: ", e)
            driver.save_screenshot('container_div_not_found.png')
            raise

        # Check the state of the myLinks element
        try:
            my_links = driver.find_element(By.ID, "myLinks")
            my_links_display = driver.execute_script("return window.getComputedStyle(arguments[0]).display;", my_links)
            print(f"myLinks display property after clicking container div: {my_links_display}")

            if my_links_display == "none":
                raise Exception("myLinks element is not displayed after clicking the container div.")
        except Exception as e:
            print("Failed to check myLinks display property after clicking container div: ", e)
            driver.save_screenshot('my_links_display_check_failed.png')
            raise

        # Wait until the menu is fully opened and profile link is visible
        try:
            WebDriverWait(driver, 2).until(
                EC.presence_of_element_located((By.LINK_TEXT, "Profile"))
            )
            print("Profile link is visible.")
        except Exception as e:
            print("Failed to find the Profile link: ", e)
            driver.save_screenshot('profile_link_not_found.png')
            raise

        # Navigate to the profile page
        try:
            profile_link = driver.find_element(By.LINK_TEXT, "Profile")
            profile_link.click()
            print("Profile link clicked.")
        except Exception as e:
            print("Failed to click the Profile link: ", e)
            driver.save_screenshot('profile_link_click_failed.png')
            raise

        # Wait until the profile page loads
        try:
            WebDriverWait(driver, 2).until(
                EC.presence_of_element_located((By.CLASS_NAME, "statistics_container"))
            )
            print("Profile statistics container is loaded.")
        except Exception as e:
            print("Failed to load the profile statistics container: ", e)
            driver.save_screenshot('profile_statistics_not_loaded.png')
            raise


    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()
