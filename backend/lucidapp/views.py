from collections import Counter
from django.shortcuts import get_object_or_404, render
from requests import Response
from rest_framework import viewsets
from rest_framework import generics
from lucidapp.models import Company, CustomDeclaration, CustomsOffice, Document, Employee, File, Invoice, InvoiceItem, Partnership, Transaction
from lucidapp.serializer import ChangePasswordSerializer, CompanySerializer, ComplexCustomDeclationSerializer, CustomDeclationSerializer, CustomOfficeSerializer, DocumentSerializer, EmployeeSerializer, FileSerializer, InvoiceItemSerializer, InvoiceSerializer, ModelNotificationSerializer, NotificationSerializer, RegisterSerializer, UserListSerializer, UserTokenObtainPairSerializer, PartnershipSerializer, TransactionSerializer, UserSerializer, UserTokenRefreshSerializer
from django.contrib.auth.models import User
from rest_framework import permissions
from django.db.models import Q
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework.views import APIView
from rest_framework import filters
from django.db.models import F, Sum
import django_filters.rest_framework

from notifications.models import Notification 


#Erstellen der Views für die API
class InvoiceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Invoice to be viewed or edited, filtering by transaction is possible. Only documents related to your company are shown.
    """
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    
    #Filterung ermöglichen 
    filterset_fields = ['transaction']

    # Feld mit Gesamtwert der Rechnung zurückgeben
    def get_queryset(self):
        return Invoice.objects.annotate(
            total_value=Sum(F('invoiceItem__price')*F('invoiceItem__amount'))
        )



class TransactionViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Transaction to be viewed or edited.
    """

    search_fields = ['description']
    filter_backends = (filters.SearchFilter,django_filters.rest_framework.DjangoFilterBackend)
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]


    # für die Suche

    filterset_fields = ['custom_offices' ]

class CustomDeclarationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows CustomsDeclarations to be viewed or edited.
    """
    queryset = CustomDeclaration.objects.all()
    serializer_class = CustomDeclationSerializer
    filterset_fields = ['transaction','status']
    permission_classes = [permissions.IsAuthenticated]



class UploadedFileViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows CustomsDeclarations to be viewed or edited.
    """
    queryset = File.objects.all()
    serializer_class = FileSerializer
    permission_classes = [permissions.IsAuthenticated]

    #filterset_fields = ['partnership']



class InvoiceItemViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows InvoiceItems to be viewed or edited.
    """
    queryset = InvoiceItem.objects.all().order_by('-id')
    serializer_class = InvoiceItemSerializer
    filterset_fields = ['invoice']
    permission_classes = [permissions.IsAuthenticated]



class CompanyViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Company to be viewed or edited.
    """
    queryset = Company.objects.all()
    filterset_fields = ['eori_nr']
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = CompanySerializer


class DocumentViewSet(viewsets.ModelViewSet):

    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    filterset_fields = ['transaction', 'type']
    ordering_fields = ['timestamp_added',]
    ordering = ['-timestamp_added']
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        
        user = self.request.user
        #if admin return all
        if user.is_superuser:
            return Document.objects.all()
        elif user.employee.custom_office is not None:
            return Document.objects.all()
        else:
            #firma ermitteln und einträge anzeigen
            company = user.employee.company
            return Document.objects.filter(Q(transaction__partnership__partner1=company) | Q(transaction__partnership__partner2=company)) 



class PartnershipViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows Partnerships to be viewed or edited. Only shows partnership where user company is involved.
    """
    serializer_class = PartnershipSerializer
    search_fields = ['partner2__name','partner2__eori_nr']
    filter_backends = (filters.SearchFilter,django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ['timestamp_added',]
    ordering = ['-timestamp_added']
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['is_archived','confirmed','partner2']



    def get_queryset(self):
        """
        This view should should return a List of all transaction a company is included in
        """

        user = self.request.user
        #if admin return all
        if user.is_superuser:
             return Partnership.objects.all()
        
        #firma ermitteln und einträge anzeigen
        company = user.employee.company
        return Partnership.objects.filter(Q(partner1=company) | Q(partner2=company)) 







class UserList(generics.ListAPIView):
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    serializer_class = UserListSerializer


class UserDetail(generics.GenericAPIView):
    def get_object(self):
        queryset = self.get_queryset()
        obj = get_object_or_404(queryset, **filter)
        return obj

""" 
class UserDetail(viewsets.ModelViewSet):

    serializer_class = UserSerializer
    def get_object(self):
        return self.request.user """


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):                                            # added string
        return super().get_queryset().filter(id=self.request.user.id)



class CompanyTransactionList(viewsets.ModelViewSet):
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    search_fields = ['description',]
    filter_backends = (filters.SearchFilter,django_filters.rest_framework.DjangoFilterBackend,filters.OrderingFilter)
    filterset_fields = ['partnership',]
    ordering_fields = ['timestamp_added','timestamp_processed']
    ordering = ['-timestamp_processed']


    def get_queryset(self):
        """
        This view should should return a List of all transaction a company is included in
        """

        user = self.request.user
        #if admin return all
        if user.is_superuser:
             return Transaction.objects.all()
        
        if user.employee.custom_office is not None:
            return Transaction.objects.all()
        
        #firma ermitteln und einträge anzeigen
        company = user.employee.company
        return Transaction.objects.filter(Q(partnership__partner1=company) | Q(partnership__partner2=company)) 

#Views für Zollbehörden

class CustomOficesView(viewsets.ModelViewSet):
    """
    API endpoint that allows Declaration to be made
    """
    queryset = CustomsOffice.objects.all()
    serializer_class = CustomOfficeSerializer
    permission_classes = [permissions.IsAuthenticated]

    filterset_fields = ['country_code']
    

class ComplexCustomDeclarationViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows CustomsDeclarations to be viewed or edited.
    """
    queryset = CustomDeclaration.objects.prefetch_related('invoice','invoice__invoiceItem','customs_office','transaction','document').all()
    serializer_class = ComplexCustomDeclationSerializer
    permission_classes = [permissions.IsAuthenticated]

    filterset_fields = ['transaction', 'customs_office']
    filter_backends = (filters.SearchFilter,django_filters.rest_framework.DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ['timestamp_added',]
    ordering = ['-timestamp_added']



class UserTokenObtainPairView(TokenObtainPairView):
    serializer_class = UserTokenObtainPairSerializer

class UserTokenRefreshView(TokenRefreshView):
    serializer_class = UserTokenRefreshSerializer


class EmployeeViewSet(viewsets.ModelViewSet):
    serializer_class = EmployeeSerializer
    permission_classes = [permissions.IsAuthenticated]


    def get_queryset(self):

        user = self.request.user
        #firma ermitteln und einträge anzeigen
        company = user.employee.company
        return Employee.objects.filter(user=user) 


#Benachrichtungen anzeigen 

class NotificationsViewSet(viewsets.ModelViewSet):
    serializer_class = ModelNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    filterset_fields = ['unread']

    def get_queryset(self):

        user = self.request.user
        return Notification.objects.filter(recipient=user)


#View für Registrierung 


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer


#View für die Registrierung 
class ChangePasswordView(generics.UpdateAPIView):
    
    queryset = User.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = ChangePasswordSerializer



