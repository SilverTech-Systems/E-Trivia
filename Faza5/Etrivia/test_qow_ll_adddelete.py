from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time
import unittest

# Mihajlo Rajic 2021/0331

BASE_URL = 'http://localhost:8000/etrivia'  
ADMIN_USERNAME = 'admin'
ADMIN_PASSWORD = '123'  
SAMPLE_QUESTION = 'Sample Question'
SAMPLE_LOGIC_LINK = 'Sample Logic Link'
LINK_TEXTS = ['Link1', 'Link2', 'Link3', 'Link4', 'Link5', 'Link6', 'Link7', 'Link8', 'Link9', 'Link10', 'Link11', 'Link12', 'Link13', 'Link14', 'Link15', 'Link16']

class TestSearchBanReset(unittest.TestCase):
  def setUp(self):
    self.driver = webdriver.Chrome()  
    self.driver.implicitly_wait(10)

  def tearDown(self):
    self.driver.quit()

  def login(self):
    self.driver.get(BASE_URL + '/admin/login')
    WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, 'username')))
    self.driver.find_element(By.ID, 'username').send_keys(ADMIN_USERNAME)
    self.driver.find_element(By.ID, 'password').send_keys(ADMIN_PASSWORD)
    self.driver.find_element(By.ID, 'login-form').submit()

  def add_question(self):
    self.driver.get(BASE_URL + '/admin/add_question')
    WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.ID, 'QuestionQOW')))
    self.driver.find_element(By.ID, 'QuestionQOW').send_keys(SAMPLE_QUESTION)
    self.driver.find_element(By.ID, 'CorrectAnswer').send_keys('Correct Answer')
    self.driver.find_element(By.ID, 'WrongAnswer1').send_keys('Wrong Answer 1')
    self.driver.find_element(By.ID, 'WrongAnswer2').send_keys('Wrong Answer 2')
    self.driver.find_element(By.ID, 'WrongAnswer3').send_keys('Wrong Answer 3')
    self.driver.find_element(By.ID, 'addQOWForm').submit()

  def remove_question(self):
    self.driver.get(BASE_URL + '/admin/remove_question')
    WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.NAME, 'delete')))
    rows = self.driver.find_elements(By.CSS_SELECTOR, 'tbody tr')
    for row in rows:
      if SAMPLE_QUESTION in row.text:
        row.find_element(By.NAME, 'delete').click()
        break
    self.driver.find_element(By.ID, 'removeQOWForm').submit()

  def add_logic_link(self):
    self.driver.get(BASE_URL + '/admin/add_logic_link')
    WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.NAME, 'description')))
    self.driver.find_element(By.NAME, 'description').send_keys(SAMPLE_LOGIC_LINK)
    for i in range(1, 9):
      self.driver.find_element(By.NAME, f'Link1{i}').send_keys(f'Link{i}')
      self.driver.find_element(By.NAME, f'Link2{i}').send_keys(f'Link{i+8}')
    self.driver.find_element(By.ID, 'addLogicLinkForm').submit()

  def remove_logic_link(self):
    self.driver.get(BASE_URL + '/admin/remove_logic_link')
    WebDriverWait(self.driver, 10).until(EC.presence_of_element_located((By.NAME, 'delete')))
    rows = self.driver.find_elements(By.CSS_SELECTOR, 'tbody tr')
    for row in rows:
      for link_text in LINK_TEXTS:
        if link_text in row.text:
          row.find_element(By.NAME, 'delete').click()
          break
    self.driver.find_element(By.ID, 'removeLogicLinkForm').submit()

  def test_search_ban_reset(self):
    self.login()
    self.add_question()
    time.sleep(2)
    self.remove_question()
    time.sleep(2)
    self.add_logic_link()
    time.sleep(2)
    self.remove_logic_link()
    time.sleep(2)

if __name__ == "__main__":
  unittest.main()
