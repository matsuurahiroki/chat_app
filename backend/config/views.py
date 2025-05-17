from rest_framework.response import Response # type: ignore
from rest_framework.decorators import api_view # type: ignore

@api_view(['GET'])
def post_list(request):
    return Response({'title': 'こんにちはNext.js!'})
