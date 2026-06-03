#!/usr/bin/env python
"""Django ning buyruq qatori yordamchisi (management uchun)."""
import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Django topilmadi. Virtual muhit faolmi? "
            "'pip install -r requirements.txt' ni bajardingizmi?"
        ) from exc
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
