# Scripts não localizam a pasta BackEnd -> arrumando o bug

import sys, os

# adiciona a pasta BackEnd ao sys.path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)