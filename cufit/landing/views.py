from django.shortcuts import render

def home(request):
    return render(request, 'landing/index.html')

def contactus(request):
    return render(request, 'landing/contactus.html')# Render the template
