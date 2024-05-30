
# autor: Uroš Rajčić 2021/0540
from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from . import views
from .views import leave_game
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from .models import Questionsqow, Questionsll, Result, User, Llfield


@staff_member_required
def admin_home(request):
    leave_game(request)
    return render(request, 'admin/admin_home.html')

@staff_member_required
def admin_logiclink(request):
    leave_game(request)
    return render(request, 'admin/admin_logiclink.html')

@staff_member_required
def admin_profile(request):
    leave_game(request)
    return render(request, 'admin/admin_profile.html')

@staff_member_required
def admin_questionofwisdom(request):
    leave_game(request)
    return render(request, 'admin/admin_questionofwisdom.html')

@staff_member_required
def admin_home(request):
    leave_game(request)
    return render(request, 'admin/admin_home.html')



def add_question(request):
    leave_game(request)
    if request.method == 'POST':
        question_text = request.POST.get('QuestionQOW')
        correct_answer = request.POST.get('CorrectAnswer')
        wrong_answer1 = request.POST.get('WrongAnswer1')
        wrong_answer2 = request.POST.get('WrongAnswer2')
        wrong_answer3 = request.POST.get('WrongAnswer3')

        try:
            question = Questionsqow(
                question=question_text,
                correct=correct_answer,
                incorrect1=wrong_answer1,
                incorrect2=wrong_answer2,
                incorrect3=wrong_answer3
            )
            question.save()
            return JsonResponse({'message': 'Uspešno'}, status=200)
        except Exception as e:
            return JsonResponse({'message': 'Neuspešno', 'error': str(e)}, status=400)

    return render(request, 'admin/admin_add_qow.html')



def remove_question(request):
    leave_game(request)
    if request.method == 'POST':
        question_ids = request.POST.getlist('delete')
        try:
            Questionsqow.objects.filter(idqow__in=question_ids).delete()
            return JsonResponse({'message': 'Uspešno'}, status=200)
        except Exception as e:
            return JsonResponse({'message': 'Neuspešno', 'error': str(e)}, status=400)

    questions = Questionsqow.objects.all()
    return render(request, 'admin/admin_remove_qow.html', {'questions': questions})



def add_logic_link(request):
    leave_game(request)
    if request.method == 'POST':
        description = request.POST.get('description')
        try:
            questions_ll, created = Questionsll.objects.get_or_create(prompt=description)

            for i in range(1, 9):
                left = request.POST.get(f'Link1{i}')
                right = request.POST.get(f'Link2{i}')
                if left and right:
                    if not Llfield.objects.filter(idll=questions_ll, left=left, right=right).exists():
                        llfield = Llfield(left=left, right=right, idll=questions_ll)
                        llfield.save()

            return JsonResponse({'message': 'Uspešno'}, status=200)
        except Exception as e:
            return JsonResponse({'message': 'Neuspešno', 'error': str(e)}, status=400)

    return render(request, 'admin/admin_add_logiclink.html')


def remove_logic_link(request):
    leave_game(request)
    if request.method == 'POST':
        link_ids = request.POST.getlist('delete')
        try:
            Llfield.objects.filter(idllfield__in=link_ids).delete()
            return JsonResponse({'message': 'Uspešno'}, status=200)
        except Exception as e:
            return JsonResponse({'message': 'Neuspešno', 'error': str(e)}, status=400)

    links = Llfield.objects.select_related('idll').all()
    return render(request, 'admin/admin_remove_logiclink.html', {'links': links})




@staff_member_required
def admin_profile_statistics(request):
    username = request.GET.get('username', None)
    context = {'username': username}

    user = User.objects.filter(username=username).first()
    if user is not None:
        user_id = user.id
        user_admin_statistics = views.get_user_statistics(user_id)
        return render(request, 'admin/admin_profile_statistics.html', {
            'user_statistics': user_admin_statistics,
            'username': username,
        })
    else:
        return render(request, 'admin/admin_profile.html', {
            'error_message': 'User does not exist',
        })

@csrf_exempt
@staff_member_required
def ban_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        try:
            user = User.objects.get(username=username)
            user.is_banned = True
            user.save()
            return HttpResponse('User banned successfully.')
        except User.DoesNotExist:
            return HttpResponse('User does not exist.', status=404)
    return HttpResponse('Invalid request.', status=400)

@csrf_exempt
@staff_member_required
def unban_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        try:
            user = User.objects.get(username=username)
            user.is_banned = False
            user.save()
            return HttpResponse('User unbanned successfully.')
        except User.DoesNotExist:
            return HttpResponse('User does not exist.', status=404)
    return HttpResponse('Invalid request.', status=400)


# Check user status
@staff_member_required
def check_user_status(request):
    username = request.GET.get('username')
    try:
        user = User.objects.get(username=username)
        return JsonResponse({'is_banned': user.is_banned})
    except User.DoesNotExist:
        return JsonResponse({'error': 'User does not exist'}, status=404)
    

# Reset user statistics
@csrf_exempt
@staff_member_required
def reset_user_statistics(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        user = User.objects.filter(username=username).first()
        if user:
            Result.objects.filter(iduser=user.id).delete()

            return JsonResponse({'message': 'Statistics reset successfully.'})
        else:
            return JsonResponse({'message': 'User not found.'}, status=404)
    return JsonResponse({'message': 'Invalid request method.'}, status=405)

def get_custom_admin_urls():
    custom_urls = [
        path('', admin.site.admin_view(admin_home), name='admin_home'),
        path('admin_home.html', admin.site.admin_view(admin_home), name='admin_home'),
        path('admin_logiclink.html', admin.site.admin_view(admin_logiclink), name='admin_logiclink'),
        path('admin_profile.html', admin.site.admin_view(admin_profile), name='admin_profile'),
        path('admin_questionofwisdom.html', admin.site.admin_view(admin_questionofwisdom), name='admin_questionofwisdom'),

        path('add_logic_link/', admin.site.admin_view(add_logic_link), name='add_logic_link'),
        path('add_question/', admin.site.admin_view(add_question), name='add_question'),
        path('remove_logic_link/', admin.site.admin_view(remove_logic_link), name='remove_logic_link'),
        path('remove_question/', admin.site.admin_view(remove_question), name='remove_question'),

        path('admin_profile_statistics/', admin.site.admin_view(admin_profile_statistics), name='admin_profile_statistics'),
        path('ban_user/', admin.site.admin_view(ban_user), name='ban_user'),
        path('unban_user/', admin.site.admin_view(unban_user), name='unban_user'),
        path('check_user_status/', admin.site.admin_view(check_user_status), name='check_user_status'),
        path('reset_user_statistics/', admin.site.admin_view(reset_user_statistics), name='reset_user_statistics'),
    ]
    return custom_urls


def get_admin_urls(urls):
    def get_urls():
        custom_urls = get_custom_admin_urls()
        return custom_urls + urls()
    return get_urls

admin.site.get_urls = get_admin_urls(admin.site.get_urls)
