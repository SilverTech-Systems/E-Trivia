
from django.test import TestCase, RequestFactory
from django.utils.timezone import now
from unittest.mock import patch, MagicMock

from Etrivia.models import Result, User
from Etrivia.views import leaderboard, generateSecretSequence, get_user_statistics

# Uroš Rajčić 0540/2021
class LeaderboardViewTest(TestCase):

    def setUp(self):
        self.factory = RequestFactory()
        self.user = User.objects.create(username='testuser')

    @patch('Etrivia.views.Result')
    def test_leaderboard_daily(self, MockResult):
        request = self.factory.get('/leaderboard?time_frame=daily')
        request.user = self.user

        mock_results = [
            MagicMock(iduser_id=self.user.id, won='won'),
            MagicMock(iduser_id=self.user.id, won='lost'),
        ]
        MockResult.objects.filter.return_value = mock_results

        response = leaderboard(request)

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'leaderboard')
        self.assertContains(response, 'testuser')

    @patch('Etrivia.views.Result')
    def test_leaderboard_weekly(self, MockResult):
        request = self.factory.get('/leaderboard?time_frame=weekly')
        request.user = self.user

        mock_results = [
            MagicMock(iduser_id=self.user.id, won='won'),
            MagicMock(iduser_id=self.user.id, won='lost'),
        ]
        MockResult.objects.filter.return_value = mock_results

        response = leaderboard(request)

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'leaderboard')
        self.assertContains(response, 'testuser')

    @patch('Etrivia.views.Result')
    def test_leaderboard_monthly(self, MockResult):
        request = self.factory.get('/leaderboard?time_frame=monthly')
        request.user = self.user

        mock_results = [
            MagicMock(iduser_id=self.user.id, won='won'),
            MagicMock(iduser_id=self.user.id, won='lost'),
        ]
        MockResult.objects.filter.return_value = mock_results

        response = leaderboard(request)

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'leaderboard')
        self.assertContains(response, 'testuser')

# Uroš Rajčić 0540/2021
class GenerateSecretSequenceTest(TestCase):

    @patch('Etrivia.views.random.randint')
    def test_generate_secret_sequence(self, mock_randint):
        mock_randint.side_effect = [1, 2, 3, 4, 5, 6, 1, 2, 3, 4, 5, 6]

        sequence = generateSecretSequence()

        self.assertEqual(sequence, [[1, 2, 3], [4, 5, 6, 1], [2, 3, 4, 5, 6]])

# Uroš Rajčić 0540/2021
class GetUserStatisticsTest(TestCase):

    def setUp(self):
        self.user = User.objects.create(username='testuser')

    @patch('Etrivia.views.Result.objects.filter')
    def test_get_user_statistics(self, mock_filter):
        mock_filter.return_value.count.side_effect = [5, 3]

        mock_aggregate = MagicMock()
        mock_aggregate.side_effect = [
            {'points1__avg': 10},
            {'points2__avg': 20},
            {'points3__avg': 30},
            {'points4__avg': 40},
        ]

        mock_filter.return_value.aggregate = mock_aggregate

        stats = get_user_statistics(self.user.id)

        self.assertEqual(stats['wins'], 5)
        self.assertEqual(stats['losses'], 3)
        self.assertEqual(stats['average_points1'], 10)
        self.assertEqual(stats['average_points2'], 20)
        self.assertEqual(stats['average_points3'], 30)
        self.assertEqual(stats['average_points4'], 40)
