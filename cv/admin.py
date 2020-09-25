from django.contrib import admin
from .models import Profile
from .models import Cv
from .models import Social_and_websites
from .models import Employment_history
from .models import Education_and_courses
from .models import Skills
from .models import Languages
from .models import References
from .models import Custom
from .models import Rodo
from .models import Codes

admin.site.register(Profile)
admin.site.register(Cv)
admin.site.register(Social_and_websites)
admin.site.register(Employment_history)
admin.site.register(Education_and_courses)
admin.site.register(Skills)
admin.site.register(Languages)
admin.site.register(References)
admin.site.register(Custom)
admin.site.register(Rodo)
admin.site.register(Codes)