# Generated by Selenium IDE
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

# Filip Rinkovec 2019/0463

class TestTestQOW():
  def setup_method(self, method):
    self.driver = webdriver.Chrome()
    self.vars = {}
  
  def teardown_method(self, method):
    self.driver.quit()
  
  def test_testQOW(self):
    self.driver.get("http://localhost:8000/etrivia/training/questionofwisdom/")
    self.driver.set_window_size(1900, 1020)
    self.driver.find_element(By.CSS_SELECTOR, ".answer:nth-child(2)").click()
    self.driver.find_element(By.ID, "submit-button").click()
    self.driver.find_element(By.ID, "submit-button").click()
    self.driver.find_element(By.CSS_SELECTOR, ".answer:nth-child(4)").click()
    self.driver.find_element(By.ID, "submit-button").click()
    self.driver.find_element(By.ID, "submit-button").click()
    self.driver.find_element(By.ID, "ne-znam").click()
    self.driver.find_element(By.ID, "submit-button").click()
    self.driver.find_element(By.ID, "submit-button").click()
    self.driver.find_element(By.ID, "back-button").click()
    elements = self.driver.find_elements(By.CSS_SELECTOR, ".center")
    assert len(elements) > 0
  
