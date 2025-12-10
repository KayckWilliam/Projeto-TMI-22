#!/usr/bin/env python3
import argparse
import os
import shutil
import subprocess
import sys
import time
from pathlib import Path


def find_venv_python(backend_dir: Path) -> str:
    """Return path to venv python if present, otherwise return system python."""
    win_path = backend_dir / '.venv' / 'Scripts' / 'python.exe'
    unix_path = backend_dir / '.venv' / 'bin' / 'python'
    if win_path.exists():
        return str(win_path)
    if unix_path.exists():
        return str(unix_path)
    py = shutil.which('python') or shutil.which('python3') or sys.executable
    return py


def has_npm() -> bool:
    return shutil.which('npm') is not None


def run_process(cmd, cwd: Path, new_console: bool):
    creationflags = 0
    if new_console and os.name == 'nt':
        creationflags = getattr(subprocess, 'CREATE_NEW_CONSOLE', 0)

    use_shell = False
    if os.name == 'nt' and isinstance(cmd, (list, tuple)) and cmd:
        if cmd[0].lower() in ('npm', 'npx'):
            use_shell = True

    try:
        if use_shell:
            cmd_str = ' '.join(cmd) if isinstance(cmd, (list, tuple)) else cmd
            proc = subprocess.Popen(cmd_str, cwd=str(cwd), creationflags=creationflags, shell=True)
        else:
            proc = subprocess.Popen(cmd, cwd=str(cwd), creationflags=creationflags)
    except TypeError:
        if use_shell:
            cmd_str = ' '.join(cmd) if isinstance(cmd, (list, tuple)) else cmd
            proc = subprocess.Popen(cmd_str, cwd=str(cwd), shell=True)
        else:
            proc = subprocess.Popen(cmd, cwd=str(cwd))
    return proc


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--no-new-console', action='store_true', help='Não abrir novas janelas de console no Windows')
    parser.add_argument('--skip-frontend-install', action='store_true', help='Pular instalação do npm')
    parser.add_argument('--backend-port', type=int, default=8000, help='Porta para backend uvicorn (padrão: 8000)')

    args = parser.parse_args()

    root = Path(__file__).resolve().parents[1]
    backend_dir = root / 'backend'
    frontend_dir = root / 'frontend'

    if not backend_dir.exists() or not frontend_dir.exists():
        print('Erro: estrutura esperada com pastas `backend/` e `frontend/`')
        sys.exit(1)

    python_exe = find_venv_python(backend_dir)
    if not python_exe:
        print('Erro: python não encontrado no PATH e nenhum venv detectado.')
        sys.exit(1)

    if not has_npm():
        print('Erro: npm não encontrado no PATH. Instale Node.js/npm.')
        sys.exit(1)

    uvicorn_cmd = [python_exe, '-m', 'uvicorn', 'main:app', '--reload', '--host', '0.0.0.0', '--port', str(args.backend_port)]
    npm_cmd = ['npm', 'run', 'start']

    if not args.skip_frontend_install:
        node_modules = frontend_dir / 'node_modules'
        if not node_modules.exists():
            print('Executando `npm install` no frontend...')
            install_proc = subprocess.run(['npm', 'install'], cwd=str(frontend_dir))
            if install_proc.returncode != 0:
                print('npm install falhou. Abortando.')
                sys.exit(1)

    new_console = not args.no_new_console

    print('\nIniciando backend:')
    print(' ', ' '.join(uvicorn_cmd))
    backend_proc = run_process(uvicorn_cmd, backend_dir, new_console=new_console)

    time.sleep(0.5)

    print('\nIniciando frontend:')
    print(' ', ' '.join(npm_cmd))
    frontend_proc = run_process(npm_cmd, frontend_dir, new_console=new_console)

    print('\n Servidores iniciados, pressione Ctrl+C para parar.')

    try:
        while True:
            if backend_proc.poll() is not None:
                print('Backend encerrado com código', backend_proc.returncode)
                break
            if frontend_proc.poll() is not None:
                print(' Frontend encerrado com código', frontend_proc.returncode)
                break
            time.sleep(1)
    except KeyboardInterrupt:
        print('\n Parando processos')
    finally:
        for p in (frontend_proc, backend_proc):
            try:
                if p and p.poll() is None:
                    p.terminate()
            except Exception:
                pass


        time.sleep(1)
        for p in (frontend_proc, backend_proc):
            try:
                if p and p.poll() is None:
                    p.kill()
            except Exception:
                pass

    print(' Concluído.')


if __name__ == '__main__':
    main()
