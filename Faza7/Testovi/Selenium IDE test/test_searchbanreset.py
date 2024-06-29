import pytest
import time
import json
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

# Mihajlo Rajic 2021/0331

class TestSearchbanreset():
  def setup_method(self, method):
    self.driver = webdriver.Chrome()
    self.vars = {}

  def teardown_method(self, method):
    self.driver.quit()

  def test_searchbanreset(self):
    self.driver.get("http://localhost:8000/etrivia/login/")
    self.driver.set_window_size(697, 1080)
    self.driver.find_element(By.ID, "id_username").send_keys("admin")
    self.driver.find_element(By.ID, "id_password").send_keys("123")
    self.driver.find_element(By.ID, "id_password").send_keys(Keys.ENTER)
    self.driver.find_element(By.LINK_TEXT, "User statistics").click()
    self.driver.find_element(By.ID, "username").click()
    self.driver.find_element(By.ID, "username").send_keys("admin2")
    self.driver.find_element(By.ID, "username").send_keys(Keys.ENTER)
    self.driver.find_element(By.LINK_TEXT, "Search").click()
    self.driver.find_element(By.ID, "reset-button").click()
    self.driver.find_element(By.ID, "ban-button").click()