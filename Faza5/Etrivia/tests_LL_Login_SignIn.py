
from django.test import TestCase, RequestFactory
from django.utils.timezone import now
from unittest.mock import patch, MagicMock

from Etrivia.models import Result, User,Llfield,Questionsll
from Etrivia.views import leaderboard, generateSecretSequence, get_user_statistics,get_random_question,get_ll

# Djordje Jovanovic 0293/2021
class LoginTest(TestCase):

    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create(username='testuser')

    def test_login_view(self):
        """Test that a user can log in"""
        response = self.client.post(reverse('login'), {'username': 'testuser', 'password': '12345'})
        self.assertEqual(response.status_code, 200)

class SigninViewTestCase(TestCase):


    def test_signin_view(self):
        """Test that a new user can sign in"""
        response = self.client.post(reverse('signin'), {
            'username': 'newuser',
            'password1': 'Banana1337',
            'password2': 'Banana1337'
        })
        self.assertEqual(response.status_code, 302)


from django.urls import reverse


class GetQuestionsViewTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create(username='testuser')
        self.prompt = Questionsll.objects.create(idll = 999,prompt='test')
        self.field1 = Llfield.objects.create(left = "left1",right = "right1",idll = self.prompt)
        self.field2 = Llfield.objects.create(left = "left2",right = "right2",idll = self.prompt)
        self.field3 = Llfield.objects.create(left = "left3",right = "right3",idll = self.prompt)
        self.field4 = Llfield.objects.create(left = "left4",right = "right4",idll = self.prompt)
        self.field5 = Llfield.objects.create(left = "left5",right = "right5",idll = self.prompt)
        self.field6 = Llfield.objects.create(left = "left6",right = "right6",idll = self.prompt)
        self.field7 = Llfield.objects.create(left = "left7",right = "right7",idll = self.prompt)
        self.field8 = Llfield.objects.create(left = "left8",right = "right8",idll = self.prompt)

    @patch('Etrivia.views.random.sample')
    @patch('Etrivia.views.random.randint')
    def test_get_qll_view(self, mock_randint,mock_sample):
        """Test that the get_qll view returns the correct JSON response"""
        mock_sample.return_value = [0,1,2,3,4,5,6,7]
        mock_randint.return_value = 0
        print(self.prompt.idll)
        response = self.client.get(reverse('get_qll'))
        self.assertEqual(response.status_code, 200)

        print(response.content)


        self.assertJSONEqual(response.content, {
            "status": "success",
            "message": "Hello from server!",
            "prompt": self.prompt.prompt,
            "id": self.prompt.idll,
            "fields": [
                [self.field1.left,self.field1.right],
                [self.field2.left,self.field2.right],
                [self.field3.left,self.field3.right],
                [self.field4.left,self.field4.right],
                [self.field5.left,self.field5.right],
                [self.field6.left,self.field6.right],
                [self.field7.left,self.field7.right],
                [self.field8.left,self.field8.right]
            ]
        })